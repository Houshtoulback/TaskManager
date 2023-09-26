const list = document.querySelector(".list-group");
const message = document.querySelector("h2");
const input = document.getElementById("my-input");
const addButton = document.getElementById("add-button");
const checkbox = document.getElementById("my-checkbox");

list.addEventListener("click", async (event) => {
    const target = event.target;
    const id = parseInt(target.parentElement.dataset.id);

    if (target.classList.contains("toggle-btn")) {
        const badge = target.parentElement.querySelector(".badge");
        try {
            const response = await axios.post("/toggle-task", { id });
            if (response.data === true) {
                if (badge.innerText === "Completed") {
                    badge.innerText = "In progress";
                    badge.classList.add("bg-secondary");
                    badge.classList.remove("bg-success");
                    target.classList.add("btn-success");
                    target.classList.remove("btn-secondary");
                } else {
                    badge.innerText = "Completed";
                    badge.classList.add("bg-success");
                    badge.classList.remove("bg-secondary");
                    target.classList.add("btn-secondary");
                    target.classList.remove("btn-success");
                }
            } else {
                alert(response.data);
            }
        } catch (e) {
            alert(e.response.data);
        }
    } else if (target.classList.contains("edit-btn")) {
        const label = target.parentElement.querySelector("label");
        const text = label.innerText;
        const answer = prompt("Please enter new title:", text);

        if (answer && answer.length >= 3) {
            try {
                const response = await axios.post("/edit-task", { id, title: answer });
                if (response.data === true) {
                    label.innerText = answer;
                } else {
                    alert(response.data);
                }
            } catch (e) {
                alert(e.response.data);
            }
        } else if (answer) {
            alert("Please enter at least 3 characters.");
        }
    } else if (target.classList.contains("delete-btn")) {
        if (confirm("Are you sure?")) {
            try {
                const response = await axios.post("/delete-task", { id });
                if (response.data === true) {
                    // location.reload();
                    target.parentElement.remove();
                    if (!document.querySelectorAll("li").length) {
                        message.classList.remove("d-none");
                        list.classList.add("d-none");
                    }
                } else {
                    alert(response.data);
                }
            } catch (e) {
                alert(e.response.data);
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const { data } = await axios.get("/get-all-tasks");
        if (data instanceof Array) {
            if (data.length) {
                list.classList.remove("d-none");
                let str = "";
                for (let task of data) {
                    str += `<li class="list-group-item d-flex bg-light" data-id="${
                        task.id
                    }">
                                <span class="flex-grow-1 d-flex align-items-center">
                                    <label>${task.title}</label>
                                    <span class="badge
                                    ${task.completed ? "bg-success" : "bg-secondary"}
                                    ms-auto me-3 user-select-none"
                                        >
                                        ${task.completed ? "Completed" : "In progress"}
                                        </span
                                    >
                                </span>
                                <button class="btn btn-sm
                                ${task.completed ? "btn-secondary" : "btn-success"}
                                me-3 toggle-btn">Toggle</button>
                                <button class="btn btn-sm btn-primary me-3 edit-btn">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                            </li>`;
                }
                list.innerHTML = str;
            } else {
                message.classList.remove("d-none");
            }
        } else {
            alert(data);
        }
    } catch (e) {
        alert(e.response.data);
    }
});

addButton.addEventListener("click", addTask);
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

async function addTask() {
    const title = input.value;
    const completed = checkbox.checked;

    if (title.length < 3) {
        alert("Please enter at least 3 characters.");
        return;
    }

    try {
        const { data } = await axios.post("/add-task", { title, completed });
        if (data > 0) {
            message.classList.add("d-none");
            list.classList.remove("d-none");
            const newItem = `<li class="list-group-item d-flex bg-light" data-id="${data}">
                                    <span class="flex-grow-1 d-flex align-items-center">
                                        <label>${title}</label>
                                        <span class="badge 
                                        ${completed ? "bg-success" : "bg-secondary"}
                                        ms-auto me-3 user-select-none"
                                            >
                                            ${completed ? "Completed" : "In progress"}
                                            </span
                                        >
                                    </span>
                                    <button class="btn btn-sm 
                                    ${completed ? "btn-secondary" : "btn-success"}
                                    me-3 toggle-btn">Toggle</button>
                                    <button class="btn btn-sm btn-primary me-3 edit-btn">Edit</button>
                                    <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                                </li>`;
            list.innerHTML += newItem;
            input.value = "";
        } else {
            alert(data);
        }
    } catch (e) {
        alert(e.response.data);
    }
}
