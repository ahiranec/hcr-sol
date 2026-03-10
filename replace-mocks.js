import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const tsFiles = walk('src');

const mappings = {
  // profilesRepo
  'getAllUsers': { repo: 'profilesRepo', isType: false, replace: 'profilesRepo.getAllUsersSync' },
  'getUserById': { repo: 'profilesRepo', isType: false, replace: 'profilesRepo.getUserByIdSync' },
  'createUser': { repo: 'profilesRepo', isType: false, replace: 'profilesRepo.createUser' },
  'updateUser': { repo: 'profilesRepo', isType: false, replace: 'profilesRepo.updateUser' },
  'deleteUser': { repo: 'profilesRepo', isType: false, replace: 'profilesRepo.deleteUser' },
  'MockUser': { repo: 'profilesRepo', isType: true, replace: 'MockUser' },
  'MockProfile': { repo: 'profilesRepo', isType: true, replace: 'MockProfile' },
  'updateUserProfile': { repo: 'profilesRepo', isType: false, replace: 'profilesRepo.updateUserProfile' },
  'canAccessSuperadminTab': { repo: 'profilesRepo', isType: false, replace: 'profilesRepo.canAccessSuperadminTabSync' },
  
  // accessesRepo
  'getUserProjectAccesses': { repo: 'accessesRepo', isType: false, replace: 'accessesRepo.getUserProjectAccessesSync' },
  'updateUserProjectAccess': { repo: 'accessesRepo', isType: false, replace: 'accessesRepo.updateUserProjectAccess' },
  'canUserAccessProject': { repo: 'accessesRepo', isType: false, replace: 'accessesRepo.canUserAccessProjectSync' },
  'canUserAdminProject': { repo: 'accessesRepo', isType: false, replace: 'accessesRepo.canUserAdminProjectSync' },
  
  // projectsRepo
  'mockProjects': { repo: 'projectsRepo', isType: false, replace: 'projectsRepo.getMockProjectsSync()' },
  'MOCK_PROJECTS': { repo: 'projectsRepo', isType: false, replace: 'projectsRepo.getPublicProjectsSync()' },
  'PROJECT_COPY': { repo: 'projectsRepo', isType: false, replace: 'projectsRepo.getProjectCopySync()' },
  'getAllHubProjects': { repo: 'projectsRepo', isType: false, replace: 'projectsRepo.getAllHubProjectsSync' },
  'MockProject': { repo: 'projectsRepo', isType: true, replace: 'MockProject' },
  'ProjectStatus': { repo: 'projectsRepo', isType: true, replace: 'ProjectStatus' },
  
  // authRepo
  'getCurrentUser': { repo: 'authRepo', isType: false, replace: 'authRepo.getCurrentUserSync' },
  'mockLogout': { repo: 'authRepo', isType: false, replace: 'authRepo.logout' }, 
  'mockLogin': { repo: 'authRepo', isType: false, replace: 'authRepo.login' },
  'mockAuthState': { repo: 'authRepo', isType: false, replace: 'authRepo.getAuthState()' },
  'mockUiState': { repo: 'authRepo', isType: false, replace: 'authRepo.getUiState()' },
  
  // homeRepo
  'getHomeHero': { repo: 'homeRepo', isType: false, replace: 'homeRepo.getHomeHeroSync' },
  'updateHomeHeroHeadline': { repo: 'homeRepo', isType: false, replace: 'homeRepo.updateHomeHeroHeadline' },
  'addHeroImage': { repo: 'homeRepo', isType: false, replace: 'homeRepo.addHeroImage' },
  'removeHeroImage': { repo: 'homeRepo', isType: false, replace: 'homeRepo.removeHeroImage' },
  'reorderHeroImages': { repo: 'homeRepo', isType: false, replace: 'homeRepo.reorderHeroImages' },
  'getHomeBranding': { repo: 'homeRepo', isType: false, replace: 'homeRepo.getHomeBrandingSync' },
  'updateHomeBranding': { repo: 'homeRepo', isType: false, replace: 'homeRepo.updateHomeBranding' },
  
  // auditRepo
  'mockAuditLog': { repo: 'auditRepo', isType: false, replace: 'auditRepo.getAuditLogsSync()' },
};

tsFiles.forEach(file => {
  if (file.includes('mocks.ts') || file.includes('repos')) return; // skip data dir mostly

  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('@/data/mocks')) return;

  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@\/data\/mocks['"];?/g;
  
  let newContent = content.replace(importRegex, (match, importsStr) => {
    const rawKeys = importsStr.split(',').map(s => s.trim()).filter(Boolean);
    const reposNeeded = {};

    for (const rawKey of rawKeys) {
      let isType = rawKey.startsWith('type ');
      let key = rawKey.replace(/^type\s+/, '');
      let mapping = mappings[key];
      
      if (mapping) {
        if (!reposNeeded[mapping.repo]) reposNeeded[mapping.repo] = new Set();
        if (mapping.isType || isType) {
          reposNeeded[mapping.repo].add(`type ${key}`);
        } else {
          reposNeeded[mapping.repo].add(mapping.repo); // Always import the repo object itself
        }
      } else {
        console.warn(`Unknown import ${key} in ${file}`);
      }
    }

    let replacement = '';
    for (const [repo, keys] of Object.entries(reposNeeded)) {
      replacement += `import { ${Array.from(keys).join(', ')} } from '@/data/repos/${repo}';\n`;
    }
    return replacement.trim();
  });

  // Second pass: replace usage
  for (const [key, mapping] of Object.entries(mappings)) {
    if (mapping.isType) continue; // No code changes for types usually
    if (mapping.replace === mapping.repo) continue;
    
    if (mapping.replace.endsWith('()')) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      newContent = newContent.replace(regex, mapping.replace);
    } else {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      newContent = newContent.replace(regex, mapping.replace);
    }
  }
  
  fs.writeFileSync(file, newContent);
  console.log(`Updated ${file}`);
});
