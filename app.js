const STORAGE_KEY = 'todo_tasks';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.createElement('main');
  app.className = 'container';

  const title = document.createElement('h1');
  title.textContent = 'ToDo List';
  app.append(title);

  const form = document.createElement('form');
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Введите задачу...';

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.style.marginLeft = '8px';

  const prioritySelect = document.createElement('select');
  ['1','2','3'].forEach(p => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = `Приоритет ${p}`;
    prioritySelect.append(option);
  });

  const addButton = document.createElement('button');
  addButton.textContent = 'Добавить';

  form.append(input, dateInput, prioritySelect, addButton);
  app.append(form);

  const settingsBtn = document.createElement('button');
  settingsBtn.textContent = 'Настройки';
  settingsBtn.style.marginTop = '8px';
  app.append(settingsBtn);

  const settingsModal = document.createElement('div');
  settingsModal.style.display = 'none';
  settingsModal.style.position = 'fixed';
  settingsModal.style.top = '50%';
  settingsModal.style.left = '50%';
  settingsModal.style.transform = 'translate(-50%, -50%)';
  settingsModal.style.background = '#1e293b';
  settingsModal.style.padding = '20px';
  settingsModal.style.borderRadius = '8px';
  settingsModal.style.zIndex = '100';
  settingsModal.style.color = '#e6eef6';
  app.append(settingsModal);

  settingsModal.className = 'settings-modal';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Поиск...';
  searchInput.style.marginLeft = '8px';
  searchInput.style.flexGrow = '1';
  searchInput.style.padding = '8px';
  settingsBtn.after(searchInput);

  searchInput.addEventListener('input', render);

  const sortSelect = document.createElement('select');
  ['manual','date_asc','date_desc'].forEach(val => {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = val === 'manual' ? 'Ручная сортировка' :
                         val === 'date_asc' ? 'По дате ↑' : 'По дате ↓';
    sortSelect.append(option);
  });

  const filterPriority = document.createElement('select');
  ['all','1','2','3'].forEach(p => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = p === 'all' ? 'Все приоритеты' : `Приоритет ${p}`;
    filterPriority.append(option);
  });

  const filterStatus = document.createElement('select');
  ['all','done','not_done'].forEach(val => {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = val === 'all' ? 'Все' : val === 'done' ? 'Выполненные' : 'Невыполненные';
    filterStatus.append(option);
  });

  const closeSettings = document.createElement('button');
  closeSettings.textContent = 'Закрыть';
  closeSettings.style.marginTop = '8px';

  const sortLabel = document.createElement('label');
  sortLabel.textContent = 'Сортировка';
  sortLabel.append(sortSelect);

  const filterPriorityLabel = document.createElement('label');
  filterPriorityLabel.textContent = 'Фильтр по приоритету';
  filterPriorityLabel.append(filterPriority);

  const filterStatusLabel = document.createElement('label');
  filterStatusLabel.textContent = 'Фильтр по статусу';
  filterStatusLabel.append(filterStatus);

  settingsModal.append(sortLabel, filterPriorityLabel, filterStatusLabel, closeSettings);

  settingsBtn.addEventListener('click', e => {
    e.preventDefault();
    settingsModal.style.display = 'block';
  });

  closeSettings.addEventListener('click', e => {
    e.preventDefault();
    settingsModal.style.display = 'none';
    render();
  });

  const list = document.createElement('ul');
  list.id = 'task-list';
  app.append(list);

  let draggedLi = null;
  const placeholder = document.createElement('li');
  placeholder.className = 'placeholder';
  placeholder.style.height = '6px';
  placeholder.style.background = '#6EE7B7';
  placeholder.style.margin = '4px 0';
  placeholder.style.borderRadius = '3px';
  placeholder.style.opacity = '0.8';

  const style = document.createElement('style');
  style.textContent = `
  body { 
    font-family: sans-serif; 
    background: #0f1620; 
    color: #e6eef6; 
    margin: 0; 
    padding: 20px; 
  }

  .container { 
    max-width: 600px; 
    margin: auto; 
    background: #1e293b; 
    border-radius: 8px; 
    padding: 20px; 
    box-shadow: 0 0 25px rgba(0,0,0,.4);
  }

  form { 
    display: flex; 
    gap: 8px; 
    margin-bottom: 16px; 
    flex-wrap: wrap; 
  }

  input, select, button { 
    padding: 8px; 
    border-radius: 6px; 
    border: none; 
    font-size: 14px;
  }

  button { 
    background: #6EE7B7; 
    color: #0f1620; 
    cursor: pointer; 
    transition: 0.15s;
  }
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(0,0,0,.3);
  }

  /* --- SETTINGS MODAL --- */
  .settings-modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    transform: translate(-50%, -50%);
    background: #162032;
    padding: 20px;
    border-radius: 10px;
    z-index: 100;
    box-shadow: 0 0 30px rgba(0,0,0,.5);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .settings-modal label {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* --- LIST STYLE --- */
  ul { 
    list-style: none; 
    padding: 0; 
  }

  li { 
    background: #26364a; 
    margin-bottom: 10px; 
    padding: 12px; 
    border-radius: 6px; 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    justify-content: space-between;
  }

  .task-main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 4px;
  }

  .task-meta {
    font-size: 12px;
    opacity: 0.7;
  }

  .placeholder {
    height: 6px !important;
    background: #6EE7B7 !important;
    border-radius: 3px;
    margin: 6px 0;
  }
`;
  document.head.append(style);
  document.body.append(app);
  let tasks = [];

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function loadTasks() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) tasks = JSON.parse(data);
  }

  function render() {
    list.innerHTML = '';

    let displayedTasks = [...tasks];

    if (sortSelect.value === 'date_asc') {
      displayedTasks.sort((a,b) => new Date(a.date) - new Date(b.date));
    } else if (sortSelect.value === 'date_desc') {
      displayedTasks.sort((a,b) => new Date(b.date) - new Date(a.date));
    }

    displayedTasks = displayedTasks.filter(task => {
      const matchesText = task.text.toLowerCase().includes(searchInput.value.toLowerCase());
      const matchesPriority = filterPriority.value === 'all' || task.priority == filterPriority.value;
      const matchesStatus = filterStatus.value === 'all' ||
                            (filterStatus.value === 'done' && task.done) ||
                            (filterStatus.value === 'not_done' && !task.done);
      return matchesText && matchesPriority && matchesStatus;
    });

    displayedTasks.forEach((task, i) => {
      const li = document.createElement('li');
      li.dataset.index = tasks.indexOf(task);

      if (sortSelect.value === 'manual') {
        li.draggable = true;
        li.addEventListener('dragstart', (e) => {
          draggedLi = li;
          draggedIndex = Number(li.dataset.index);

          li.after(placeholder);

          setTimeout(() => {
            li.style.display = 'none';
          });
        });


        li.addEventListener('dragend', () => {
          if (draggedLi) draggedLi.style.display = 'flex';
          placeholder.remove();
          draggedLi = null;
        });
      } else {
        li.draggable = false;
      }

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', () => {
        task.done = checkbox.checked;
        saveTasks();
        render();
      });

      const span = document.createElement('span');
      span.textContent = task.text;
      span.contentEditable = true;
      span.addEventListener('blur', () => {
        task.text = span.textContent.trim() || 'Пустое название';
        saveTasks();
        render();
      });

      const prioritySpan = document.createElement('span');
      prioritySpan.textContent = `Приоритет ${task.priority}`;

      const dateSpan = document.createElement('span');
      const dateObj = new Date(task.date);
      dateSpan.textContent = `(${String(dateObj.getDate()).padStart(2,'0')}.${String(dateObj.getMonth()+1).padStart(2,'0')}.${dateObj.getFullYear()})`;

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️';
      deleteBtn.addEventListener('click', () => {
        const index = tasks.indexOf(task);
        if (index > -1) tasks.splice(index, 1);
        saveTasks();
        render();
      });

      if (task.done) {
        span.style.textDecoration = 'line-through';
        span.style.opacity = '0.6';
      }

      const textBlock = document.createElement('div');
      textBlock.className = 'task-main';
      textBlock.append(span);

      const meta = document.createElement('div');
      meta.className = 'task-meta';
      meta.textContent = `Приоритет ${task.priority} • ${dateSpan.textContent}`;

      textBlock.append(meta);

      li.append(checkbox, textBlock, deleteBtn);
      list.append(li);
    });

    saveTasks();
  }

  list.addEventListener('dragover', (e) => {
    if (!draggedLi || sortSelect.value !== 'manual') return;
    e.preventDefault();

    const target = e.target.closest('li');
    if (!target || target === placeholder) return;
    if (target === draggedLi) return; // ← ВАЖНО: если перетаскиваем в то же место — ничего не меняем

    const rect = target.getBoundingClientRect();
    const offset = e.clientY - rect.top;

    if (offset > rect.height / 2) {
      target.after(placeholder);
    } else {
      target.before(placeholder);
    }
  });

  list.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!draggedLi) return;

    const oldIndex = draggedIndex;
    const newIndex = Array.from(list.children).indexOf(placeholder);

    if (newIndex === oldIndex || newIndex === oldIndex + 1) {
      placeholder.remove();
      draggedLi.style.display = 'flex';
      draggedLi = null;
      draggedIndex = null;
      return;
    }

    const [moved] = tasks.splice(oldIndex, 1);
    tasks.splice(newIndex > oldIndex ? newIndex - 1 : newIndex, 0, moved);

    saveTasks();
    render();
  });



  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!input.value.trim()) return;

    const date = dateInput.value ? new Date(dateInput.value) : new Date();

    tasks.push({
      text: input.value.trim(),
      done: false,
      date: date.toISOString(),
      priority: Number(prioritySelect.value)
    });

    input.value = '';
    dateInput.value = '';
    render();
  });

  loadTasks();
  render();
});