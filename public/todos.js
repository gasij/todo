// Добавить задачу
async function addTodo() {
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;
    const dueDate = document.getElementById('todo-due-date').value;
  
    if (!title) {
      alert('Введите название задачи');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, dueDate })
      });
  
      const todo = await response.json();
      
      if (response.ok) {
        document.getElementById('todo-title').value = '';
        document.getElementById('todo-description').value = '';
        document.getElementById('todo-due-date').value = '';
        loadTodos();
      } else {
        alert(todo.error || 'Ошибка при добавлении задачи');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при добавлении задачи');
    }
  }
  
  // Загрузить список задач
  async function loadTodos() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const todos = await response.json();
      
      if (response.ok) {
        renderTodos(todos);
      } else {
        alert(todos.error || 'Ошибка при загрузке задач');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при загрузке задач');
    }
  }
  
  // Отобразить задачи
  function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
  
    todos.forEach(todo => {
      const todoItem = document.createElement('div');
      todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      
      todoItem.innerHTML = `
        <div class="todo-content">
          <h3>${todo.title}</h3>
          ${todo.description ? `<p>${todo.description}</p>` : ''}
          ${todo.dueDate ? `<p class="due-date">До: ${new Date(todo.dueDate).toLocaleDateString()}</p>` : ''}
        </div>
        <div class="actions">
          <button class="complete-btn" onclick="toggleComplete(${todo.id}, ${!todo.completed})">
            ${todo.completed ? 'Вернуть' : 'Завершить'}
          </button>
          <button class="delete-btn" onclick="deleteTodo(${todo.id})">Удалить</button>
        </div>
      `;
  
      todoList.appendChild(todoItem);
    });
  }
  
  // Переключить статус задачи
  async function toggleComplete(id, completed) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed })
      });
  
      if (response.ok) {
        loadTodos();
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при обновлении задачи');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при обновлении задачи');
    }
  }
  
  // Удалить задачу
  async function deleteTodo(id) {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        loadTodos();
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при удалении задачи');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при удалении задачи');
    }
  }