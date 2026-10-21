const fs = require('fs');
const path = require('path');

const featureName = process.argv[2];
if (!featureName) {
  console.error('Usage: bun fix-imports.js <feature-name>');
  process.exit(1);
}

const SRC_DIR = path.resolve(__dirname, '../../../src');
const FEATURE_DIR = path.join(SRC_DIR, 'features', featureName);

if (!fs.existsSync(FEATURE_DIR)) {
  console.error(`Error: Feature directory not found at ${FEATURE_DIR}`);
  process.exit(1);
}

let totalFixed = 0;

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile()) {
      callback(filepath);
    }
  }
}

// Auxiliar para saber se uma pasta possui index.ts
function hasBarrel(dirPath) {
  return fs.existsSync(path.join(dirPath, 'index.ts')) || fs.existsSync(path.join(dirPath, 'index.tsx'));
}

walkSync(FEATURE_DIR, (filepath) => {
  // Ignorar arquivos não-TS/TSX e index.ts (onde relativos são ok)
  if (filepath.endsWith('index.ts') || (!filepath.endsWith('.ts') && !filepath.endsWith('.tsx'))) {
    return;
  }

  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;

  // 0. Ordenar destructuring internamente: import { B, A } -> import { A, B }
  const destructuringRegex = /import\s+(type\s+)?{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
  content = content.replace(destructuringRegex, (match, typeKeyword, destructuredParams, importPath) => {
    const items = destructuredParams.split(',').map(s => s.trim()).filter(Boolean);
    
    // Checar se já está ordenado pra evitar falso "changed = true"
    const originalItemsStr = items.join(', ');

    items.sort((a, b) => {
      if (a.length !== b.length) {
        return a.length - b.length; // Ascendente por tamanho
      }
      return a.localeCompare(b); // Alfabético como desempate
    });

    const sortedItemsStr = items.join(', ');
    if (originalItemsStr !== sortedItemsStr) {
      changed = true;
      console.log(`[FIX-DESTRUCTURING] ${path.relative(FEATURE_DIR, filepath)}\n  - { ${originalItemsStr} } -> { ${sortedItemsStr} }`);
    }

    const typeStr = typeKeyword ? typeKeyword : '';
    return `import ${typeStr}{ ${sortedItemsStr} } from '${importPath}'`;
  });

  // 1. Corrigir caminhos (Relativo -> Absoluto e Barrel)
  const importRegex = /import\s+(?:(?:{[^}]+})|(?:\*\s+as\s+[\w]+)|(?:\w+))\s+from\s+['"]([^'"]+)['"]/g;
  
  content = content.replace(importRegex, (match, importPath) => {
    // Excecao: Estilos
    if (importPath.endsWith('.css') || importPath.endsWith('.css.ts') || importPath.endsWith('.styles.ts')) {
      return match;
    }

    let finalPath = importPath;

    // A. Converter relativo para absoluto
    if (finalPath.startsWith('.')) {
      const absoluteImportPath = path.resolve(path.dirname(filepath), finalPath);
      if (absoluteImportPath.startsWith(FEATURE_DIR)) {
        const relativeToFeature = absoluteImportPath.substring(FEATURE_DIR.length).replace(/\\/g, '/');
        finalPath = `@${featureName}${relativeToFeature}`;
      } else if (absoluteImportPath.startsWith(SRC_DIR)) {
        const relativeToSrc = absoluteImportPath.substring(SRC_DIR.length).replace(/\\/g, '/');
        // heuristica simples para outras pastas do src
        const segments = relativeToSrc.split('/').filter(Boolean);
        if (segments[0] === 'features') {
          finalPath = `@${segments[1]}/${segments.slice(2).join('/')}`;
        } else {
          finalPath = `@${segments[0]}/${segments.slice(1).join('/')}`;
        }
      }
    }

    // B. Forçar regra do Barrel (remover o nome do arquivo se a pasta tiver index.ts)
    // Precisamos resolver o absolute do import finalPath.
    // Como os aliases padrão são conhecidos:
    let resolvedTarget = null;
    if (finalPath.startsWith(`@${featureName}/`)) {
      resolvedTarget = path.join(FEATURE_DIR, finalPath.substring(`@${featureName}/`.length));
    } else if (finalPath.startsWith('@shared/')) {
      resolvedTarget = path.join(SRC_DIR, 'shared', finalPath.substring('@shared/'.length));
    } else if (finalPath.startsWith('@domain/')) {
      resolvedTarget = path.join(SRC_DIR, 'domain', finalPath.substring('@domain/'.length));
    }

    if (resolvedTarget) {
      // Se aponta pra um arquivo específico (sem extensao), verificar se o diretorio pai tem barrel
      if (!fs.existsSync(resolvedTarget) && !hasBarrel(resolvedTarget)) {
        const dirOfTarget = path.dirname(resolvedTarget);
        if (hasBarrel(dirOfTarget)) {
          // O diretorio pai tem index.ts, logo o import direto do arquivo é proibido
          finalPath = finalPath.substring(0, finalPath.lastIndexOf('/'));
        }
      }
    }

    if (finalPath !== importPath) {
      changed = true;
      console.log(`[FIX-PATH] ${path.relative(FEATURE_DIR, filepath)}\n  - ${importPath} -> ${finalPath}`);
      return match.replace(importPath, finalPath);
    }
    return match;
  });

  // 2. Ordenar Imports (Ascendente + Estilos pro final)
  const allImportsRegex = /^(?:import\s+.*?from\s+['"][^'"]+['"];?\s*)+/m;
  const match = content.match(allImportsRegex);
  if (match) {
    const importBlock = match[0];
    const lines = importBlock.split('\n').filter(l => l.trim().startsWith('import'));
    
    // Sort logic
    const stylesLines = [];
    const regularLines = [];
    
    for (const line of lines) {
      if (line.includes('.css') || line.includes('.styles.ts')) {
        stylesLines.push(line);
      } else {
        regularLines.push(line);
      }
    }

    regularLines.sort((a, b) => a.length - b.length);
    stylesLines.sort((a, b) => a.length - b.length);

    let newImportBlock = regularLines.join('\n') + '\n';
    if (stylesLines.length > 0) {
      newImportBlock += '\n' + stylesLines.join('\n') + '\n';
    }

    if (newImportBlock.trim() !== importBlock.trim()) {
      content = content.replace(importBlock, newImportBlock);
      changed = true;
      console.log(`[FIX-ORDER] ${path.relative(FEATURE_DIR, filepath)}`);
    }
  }

  if (changed) {
    fs.writeFileSync(filepath, content, 'utf8');
    totalFixed++;
  }
});

console.log(`\nImport fix completed for '${featureName}'. Total files modified: ${totalFixed}`);
