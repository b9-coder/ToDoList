// Class for create Tasks

class Task {
    constructor(value) {
        this.value = value;
    };

    // Create task with status "Done"
    createDoneTask() {
        let taskDoneItem = document.createElement("li");
        taskDoneItem.className = "todo-list__item todo-list__item--done";
        taskDoneItem.innerHTML = `
            <input type="text" class="todo-list__value" disabled value="${this.value}">
            <button class="todo-list__btn-edit">edit</button>
            <button class="todo-list__btn-remove">del</i></button>
        `;
        return taskDoneItem;
    };

    // Create task with status "Undone"
    createUndoneTask() {
        let taskUndoneItem = document.createElement("li");
        taskUndoneItem.className = "todo-list__item";
        taskUndoneItem.innerHTML = `
            <input type="text" class="todo-list__value" disabled value="${this.value}">
            <button class="todo-list__btn-edit">edit</i></button>
            <button class="todo-list__btn-remove">del</i></button>
        `;
        return taskUndoneItem;
    };
};

// Class for create tasks list
class List {
    constructor(taskInput, taskListDone, taskListUnDone) {
        this.taskInput = taskInput;
        this.taskListDone = taskListDone;
        this.taskListUnDone = taskListUnDone;
        this.undoneTaskArr = JSON.parse(localStorage.getItem("undoneTask")) || [];
        this.doneTaskArr = JSON.parse(localStorage.getItem("doneTask")) || [];
        this.renderUndoneTask();
        this.renderDoneTask();
    };

    // Render Undone tasks list
    renderUndoneTask() {
        for (let i = 0; i < this.undoneTaskArr.length; i++) {
            const task = new Task(this.undoneTaskArr[i]);
            this.taskListUnDone.appendChild(task.createUndoneTask());
        };
    };

    // Render Done tasks list
    renderDoneTask() {
        for (let i = 0; i < this.doneTaskArr.length; i++) {
            const task = new Task(this.doneTaskArr[i]);
            this.taskListDone.appendChild(task.createDoneTask());
        };
    };

    // Create new task
    addTask() {
        if (this.taskInput.value === "") {
            
        } else {
            const task = new Task(this.taskInput.value);
            this.undoneTaskArr.push(this.taskInput.value);
            this.taskListUnDone.appendChild(task.createUndoneTask());
            this.taskToLocal("undoneTask", this.undoneTaskArr);
            this.taskInput.value = "";
        };
    };

    // Remove task form list
    removeTask(target) {
        if (!target.classList.contains("todo-list__btn-remove")) return;
        let li = target.parentElement;
        if (li.classList.contains("todo-list__item--done")) {
            let index = [...li.parentElement.children].indexOf(li);
            this.doneTaskArr.splice(index - 1, 1);
            this.taskToLocal("doneTask", this.doneTaskArr);
            li.remove();
        } else {
            let index = [...li.parentElement.children].indexOf(li);
            this.undoneTaskArr.splice(index - 1, 1);
            this.taskToLocal("undoneTask", this.undoneTaskArr);
            li.remove();
        }
    };

    // Editing task
    editTask(target) {
        if (!target.classList.contains("todo-list__btn-edit")) return;
        let li = target.parentElement;
        let input = target.previousElementSibling;
        if (input.disabled === true) {
            input.disabled = false;
            input.classList.add("todo-list__value--editable");
            input.focus();
        } else {
            this.saveEditTask(li, input);
        };
    };

    // Saving changes after editing
    saveEditTask(li, input) {
        let index = [...li.parentElement.children].indexOf(li);
        if (li.classList.contains("todo-list__item--done")) {
            this.doneTaskArr.splice(index - 1, 1, input.value);
            this.taskToLocal("doneTask", this.doneTaskArr);
        } else {
            this.undoneTaskArr.splice(index - 1, 1, input.value);
            this.taskToLocal("undoneTask", this.undoneTaskArr);
        }
        input.disabled = true;
        input.classList.remove("todo-list__value--editable");
    };

    // Task status check
    checkTask(target) {
        if (!target.classList.contains("todo-list__item")) return;
        if (target.classList.contains("todo-list__item--done")) {
            this.doTaskUndone(target);
        } else {
            this.doTaskDone(target);
        }
    }

    // Add "Done" status for task
    doTaskDone(target) {
        let index = [...target.parentElement.children].indexOf(target);
        this.undoneTaskArr.splice(index - 1, 1);
        this.doneTaskArr.push(target.children[0].value);
        this.taskToLocal("undoneTask", this.undoneTaskArr);
        this.taskToLocal("doneTask", this.doneTaskArr);
        const task = new Task(target.children[0].value);
        this.taskListDone.appendChild(task.createDoneTask());
        target.remove();
    }

    // Add "Undone" status for task
    doTaskUndone(target) {
        let index = [...target.parentElement.children].indexOf(target);
        this.doneTaskArr.splice(index - 1, 1);
        this.undoneTaskArr.push(target.children[0].value);
        this.taskToLocal("undoneTask", this.undoneTaskArr);
        this.taskToLocal("doneTask", this.doneTaskArr);
        const task = new Task(target.children[0].value);
        this.taskListUnDone.appendChild(task.createUndoneTask());
        target.remove();
    }

    // Save information to localStorage
    taskToLocal(name, arr) {
        localStorage.setItem(name, JSON.stringify(arr));
    };
};


let taskInput = document.querySelector(".todo-list__input");
let taskAdd = document.querySelector(".todo-list__btn-add");
let todo = document.querySelector(".todo-list");
let doneList = document.querySelector(".todo-list__items-done");
let undoneList = document.querySelector(".todo-list__items-undone");

let list = new List(taskInput, doneList, undoneList);

todo.addEventListener("click", function (e) {
    let target = e.target;
    list.removeTask(target);
    list.editTask(target);
    list.checkTask(target);
});

taskAdd.addEventListener("click", function () {
    list.addTask();
});

taskInput.addEventListener("keypress", function (e) {
    if (e.keyCode === 13) {
        list.addTask();
    }
});