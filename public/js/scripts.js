const list = document.querySelector(".list-group");

list.addEventListener("click", async (event) => {
    const target = event.target;
    const id = parseInt(target.parentElement.dataset.id);

    if (target.classList.contains("toggle-btn")) {
        try {
            const response = await axios.post("/toggle-task", { id });
            if (response.data === true) {
                location.reload();
            } else {
                alert(response.data);
            }
        } catch (e) {
            alert(e.response.data);
        }
    } else if (target.classList.contains("edit-btn")) {
        const text = target.parentElement.querySelector("label").innerText;
        const answer = prompt("Please enter new title:", text);

        if (answer && answer.length >= 3) {
            try {
                const response = await axios.post("/edit-task", { id, title: answer });
                if (response.data === true) {
                    location.reload();
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
                        const ul = document.querySelector("ul");
                        ul.outerHTML =
                            '<h2 class="text-center">There is not any task</h2>';
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
