const STORAGE_KEY = 'todo_tasks'

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) tasks = JSON.parse(data);
}

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
  const button = document.createElement('button');
  button.textContent = 'Добавить';
  form.append(input, button);
  app.append(form);

  const list = document.createElement('ul');
  list.id = 'task-list';
  app.append(list);

  const style = document.createElement('style');
  style.textContent = `
  body { font-family: sans-serif; background: #0f1620; color: #e6eef6; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: auto; background: #1e293b; border-radius: 8px; padding: 20px; }
  form { display: flex; gap: 8px; margin-bottom: 16px; }
  input, button { padding: 8px; border-radius: 6px; border: none; }
  button { background: #6EE7B7; color: #0f1620; cursor: pointer; }
  ul { list-style: none; padding: 0; }
  li { background: #334155; margin-bottom: 8px; padding: 8px; border-radius: 6px; }
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

  const render = () => {
    list.innerHTML = '';
    tasks.forEach((task, i) => {
      const li = document.createElement('li');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', () => {
        task.done = checkbox.checked;
        render();
      })

      const span = document.createElement('span');
      span.textContent = task.text;
      span.contentEditable = true;
      span.addEventListener('blur', () => {
        task.text = span.textContent.trim() || 'Пустое название';
        render();
      })

      
      const btn = document.createElement('button');
      btn.textContent = '🗑️';
      btn.addEventListener('click', () => {
        tasks.splice(i, 1);
        render();
      });

      if (task.done) {
        span.style.textDecoration = 'line-through';
        span.style.opacity = '0.6';
      }

      li.append(checkbox, span, btn);
      list.append(li);
    });
    saveTasks();
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (input.value.trim()) {
      tasks.push({ text: input.value.trim(), done: false});
      input.value = '';
      render();
    }
  });

  loadTasks();
  render();
});