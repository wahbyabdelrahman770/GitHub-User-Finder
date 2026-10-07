const input = document.querySelector("input");
const showBtn = document.querySelector(".btn-primary");
const clearBtn = document.querySelector(".btn-danger");
const loadingDiv = document.querySelector(".loading");
const errorDiv = document.querySelector(".error");
const resultDiv = document.querySelector(".result");

const api = "https://api.github.com/users";

input.addEventListener("input", () => {
    let value = input.value;
    if (value.length > 2) {
        showBtn.disabled = false;
    }
    else {
        showBtn.disabled = true;
    }
});

function clear() {
    errorDiv.classList.add("d-none");
    resultDiv.classList.replace("d-flex", "d-none");
}

clearBtn.addEventListener("click", () => {
    clear();
    clearBtn.disabled = true;
});

showBtn.addEventListener("click", () => {
    clear();

    let value = input.value;

    loadingDiv.innerHTML = `
        <p>Searching for ${value}...</p>
    `;
    loadingDiv.classList.remove("d-none");

    let userApi = api + `/${value}`;
    fetch(userApi)
        .then(response => response.json())
        .then((user) => {
            loadingDiv.classList.add("d-none");
            if (user.status === "404") {
                errorDiv.innerHTML = `<p>Sorry, we couldn't find this GitHub user.</p>`;
                errorDiv.classList.remove("d-none");
            }
            else {
                resultDiv.innerHTML = `
                    <img src="${user.avatar_url}" class="rounded-circle w-20">
                    <h2 class="text-light text-center">${user.name ? user.name : user.login}</h2>
                    <p class="fw-medium text-secondary text-center">@${user.login}</p>
                    <p class="text-info text-center">${user.bio ? user.bio : "This user doesn't have a bio."}</p>
                    <div class="mt-2 d-flex flex-row justify-content-center column-gap-3">
                        <div class="bg-body rounded-3 p-3 text-center">
                            <h5>${user.public_repos}</h5>
                            <p>Repositories</p>
                        </div>
                        <div class="bg-body rounded-3 p-3 text-center">
                            <h5>${user.followers}</h5>
                            <p>Followers</p>
                        </div>
                        <div class="bg-body rounded-3 p-3 text-center">
                            <h5>${user.following}</h5>
                            <p>Following</p>
                        </div>
                    </div>`;
                resultDiv.classList.replace("d-none", "d-flex");
            }
        })
        .catch(() => {
            loadingDiv.classList.add("d-none");
            errorDiv.innerHTML = `<p>Something went wrong. Please try again.</p>`;
            errorDiv.classList.remove("d-none");
        })
        .finally(() => {
            input.value = "";
            showBtn.disabled = true;
            clearBtn.disabled = false;
        });
});