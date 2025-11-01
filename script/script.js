document.addEventListener('DOMContentLoaded', () => {
      const folderInput = document.getElementById('folderInput');
      const dropZone = document.getElementById('dropZone');
      const output = document.getElementById('output');
      const searchInput = document.getElementById('searchInput');
      const expandAllBtn = document.getElementById('expandAllBtn');
      const collapseAllBtn = document.getElementById('collapseAllBtn');
      const copyBtn = document.getElementById('copyBtn');
      const fileCount = document.getElementById('fileCount');
      const toast = document.getElementById('toast');
      const toastMessage = document.getElementById('toastMessage');
      const themeToggle = document.getElementById('themeToggle');
      const body = document.body;

      let fileTree = null;
      let filePaths = [];

      // Alternar tema
      themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        // Salvar preferência no localStorage
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });

      // Verificar preferência de tema salva
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
      }

      // Eventos de drag and drop
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });

      dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (!dropZone.contains(e.relatedTarget)) {
          dropZone.classList.remove('drag-over');
        }
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const items = e.dataTransfer.items;
        const files = [];
        
        if (items) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
              const entry = item.webkitGetAsEntry();
              if (entry) {
                if (entry.isDirectory) {
                  processDirectory(entry, files, '').then(() => {
                    if (files.length > 0) {
                      processFiles(files);
                    }
                  });
                } else {
                  files.push({
                    file: item.getAsFile(),
                    relativePath: entry.name
                  });
                  processFiles(files);
                }
              }
            }
          }
        }
      });

      // Clique na zona de drop para abrir seletor de arquivos
      dropZone.addEventListener('click', () => {
        folderInput.click();
      });

      // Função para processar diretórios recursivamente
      async function processDirectory(dirEntry, files, path) {
        return new Promise((resolve) => {
          const dirReader = dirEntry.createReader();
          
          function readEntries() {
            dirReader.readEntries((entries) => {
              if (entries.length === 0) {
                resolve();
                return;
              }
              
              const promises = [];
              
              for (const entry of entries) {
                const entryPath = path ? `${path}/${entry.name}` : entry.name;
                
                if (entry.isDirectory) {
                  promises.push(processDirectory(entry, files, entryPath));
                } else {
                  promises.push(new Promise((resolveFile) => {
                    entry.file((file) => {
                      files.push({
                        file: file,
                        relativePath: entryPath
                      });
                      resolveFile();
                    });
                  }));
                }
              }
              
              Promise.all(promises).then(() => {
                readEntries(); // Continuar lendo mais entradas
              });
            });
          }
          
          readEntries();
        });
      }

      // Função para processar arquivos e construir a árvore
      function processFiles(files) {
        filePaths = files.map(f => f.relativePath);
        fileTree = buildTree(filePaths);

        output.innerHTML = '';
        const treeElement = renderTree(fileTree);
        output.appendChild(treeElement);
        
        // Atualizar contador
        const totalItems = filePaths.length;
        fileCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
        fileCount.classList.remove('hidden');
        
        // Habilitar controles
        searchInput.disabled = false;
        expandAllBtn.disabled = false;
        collapseAllBtn.disabled = false;
        copyBtn.disabled = false;
        
        // Recolher todos os itens inicialmente
        collapseAll();
      }

      // Função para construir a árvore de arquivos
      function buildTree(paths) {
        const root = {};
        for (const path of paths) {
          const parts = path.split('/');
          let current = root;
          for (const part of parts) {
            if (part === '') continue;
            if (!current[part]) {
              current[part] = { __isFile: false, children: {} };
            }
            current = current[part].children;
          }
          // Marcar o último elemento como arquivo
          if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            if (lastPart !== '') {
              const parentParts = parts.slice(0, -1);
              let parent = root;
              for (const part of parentParts) {
                if (part === '') continue;
                parent = parent[part].children;
              }
              parent[lastPart].__isFile = true;
            }
          }
        }
        return root;
      }

      // Função para renderizar a árvore
      function renderTree(node, level = 0, parentPath = '') {
        const ul = document.createElement('ul');
        
        // Ordenar: pastas primeiro, depois arquivos
        const sortedKeys = Object.keys(node).sort((a, b) => {
          const aIsFile = node[a].__isFile;
          const bIsFile = node[b].__isFile;
          if (aIsFile && !bIsFile) return 1;
          if (!aIsFile && bIsFile) return -1;
          return a.localeCompare(b);
        });

        for (const key of sortedKeys) {
          const isFile = node[key].__isFile;
          const hasChildren = Object.keys(node[key].children).length > 0;
          const currentPath = parentPath ? `${parentPath}/${key}` : key;
          
          const li = document.createElement('li');
          li.dataset.path = currentPath;
          
          if (isFile) {
            // É um arquivo
            const fileElement = document.createElement('div');
            fileElement.className = 'file fade-in';
            fileElement.innerHTML = `<i class="far fa-file"></i> ${key}`;
            li.appendChild(fileElement);
          } else {
            // É uma pasta
            const folderElement = document.createElement('div');
            folderElement.className = 'folder fade-in';
            
            if (hasChildren) {
              folderElement.innerHTML = `<i class="fas fa-caret-right"></i> <i class="far fa-folder"></i> ${key}`;
              folderElement.addEventListener('click', (e) => {
                e.stopPropagation();
                const childList = li.querySelector('ul');
                if (childList) {
                  folderElement.classList.toggle('collapsed');
                  childList.classList.toggle('hidden');
                }
              });
            } else {
              folderElement.innerHTML = `<i class="far fa-folder"></i> ${key}`;
              folderElement.style.cursor = 'default';
            }
            
            li.appendChild(folderElement);
            
            if (hasChildren) {
              const childList = renderTree(node[key].children, level + 1, currentPath);
              li.appendChild(childList);
            }
          }
          
          ul.appendChild(li);
        }
        
        return ul;
      }

      // Função para expandir todos os itens
      function expandAll() {
        const folders = output.querySelectorAll('.folder');
        const lists = output.querySelectorAll('ul');
        
        folders.forEach(folder => {
          folder.classList.remove('collapsed');
        });
        
        lists.forEach(list => {
          list.classList.remove('hidden');
        });
      }

      // Função para recolher todos os itens
      function collapseAll() {
        const folders = output.querySelectorAll('.folder');
        const lists = output.querySelectorAll('ul');
        
        // Manter apenas o primeiro nível expandido
        folders.forEach(folder => {
          if (folder.closest('li').parentElement !== output.querySelector('.tree > ul')) {
            folder.classList.add('collapsed');
          }
        });
        
        lists.forEach(list => {
          if (list.parentElement.parentElement !== output.querySelector('.tree')) {
            list.classList.add('hidden');
          }
        });
      }

      // Função para filtrar a árvore
      function filterTree(query) {
        const allItems = output.querySelectorAll('li');
        
        if (!query) {
          // Mostrar todos os itens
          allItems.forEach(item => {
            item.style.display = '';
            // Expandir para mostrar os itens
            let parent = item.parentElement;
            while (parent && parent !== output) {
              if (parent.tagName === 'UL') {
                parent.classList.remove('hidden');
                const folder = parent.previousElementSibling;
                if (folder && folder.classList.contains('folder')) {
                  folder.classList.remove('collapsed');
                }
              }
              parent = parent.parentElement;
            }
          });
          return;
        }
        
        // Esconder todos os itens primeiro
        allItems.forEach(item => {
          item.style.display = 'none';
        });
        
        // Mostrar apenas os itens que correspondem à busca
        allItems.forEach(item => {
          const path = item.dataset.path.toLowerCase();
          if (path.includes(query.toLowerCase())) {
            item.style.display = '';
            
            // Expandir todos os pais para mostrar o item
            let parent = item.parentElement;
            while (parent && parent !== output) {
              if (parent.tagName === 'UL') {
                parent.classList.remove('hidden');
                const folder = parent.previousElementSibling;
                if (folder && folder.classList.contains('folder')) {
                  folder.classList.remove('collapsed');
                }
              }
              parent = parent.parentElement;
            }
          }
        });
      }

      // Função para copiar a estrutura
      function copyStructure() {
        let structureText = '';
        
        function buildTextStructure(node, indent = '') {
          const sortedKeys = Object.keys(node).sort((a, b) => {
            const aIsFile = node[a].__isFile;
            const bIsFile = node[b].__isFile;
            if (aIsFile && !bIsFile) return 1;
            if (!aIsFile && bIsFile) return -1;
            return a.localeCompare(b);
          });
          
          for (const key of sortedKeys) {
            const isFile = node[key].__isFile;
            structureText += `${indent}${isFile ? '📄 ' : '📁 '}${key}\n`;
            
            if (!isFile && Object.keys(node[key].children).length > 0) {
              buildTextStructure(node[key].children, indent + '  ');
            }
          }
        }
        
        if (fileTree) {
          buildTextStructure(fileTree);
          navigator.clipboard.writeText(structureText)
            .then(() => {
              showToast('Estrutura copiada para a área de transferência!');
            })
            .catch(err => {
              console.error('Erro ao copiar: ', err);
              showToast('Erro ao copiar estrutura!', true);
            });
        }
      }

      // Função para mostrar notificação
      function showToast(message, isError = false) {
        toastMessage.textContent = message;
        
        if (isError) {
          toast.classList.add('error');
          toast.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + toast.innerHTML;
        } else {
          toast.classList.remove('error');
          toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + toast.innerHTML;
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3000);
      }

      // Evento quando uma pasta é selecionada
      folderInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (!files.length) return;

        filePaths = Array.from(files).map(f => f.webkitRelativePath);
        fileTree = buildTree(filePaths);

        output.innerHTML = '';
        const treeElement = renderTree(fileTree);
        output.appendChild(treeElement);
        
        // Atualizar contador
        const totalItems = filePaths.length;
        fileCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
        fileCount.classList.remove('hidden');
        
        // Habilitar controles
        searchInput.disabled = false;
        expandAllBtn.disabled = false;
        collapseAllBtn.disabled = false;
        copyBtn.disabled = false;
        
        // Recolher todos os itens inicialmente
        collapseAll();
      });

      // Eventos dos botões
      expandAllBtn.addEventListener('click', expandAll);
      collapseAllBtn.addEventListener('click', collapseAll);
      copyBtn.addEventListener('click', copyStructure);
      
      // Evento de busca
      searchInput.addEventListener('input', (e) => {
        filterTree(e.target.value);
      });
    });