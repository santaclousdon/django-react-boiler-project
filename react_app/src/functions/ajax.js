import $ from "jquery";

function ajax_wrapper(type, url, data, returnFunc) {
    // Routing to Django on development
    if (window.location.hostname === "localhost") {
        url = "http://localhost:8000" + url;
    }

    // Adding Django token for POST requests
    if (type === "POST") {
        data.csrfmiddlewaretoken = window.secretReactVars.csrfmiddlewaretoken;
    }

    if (type === "POST" || type === "PUT") {
        data = JSON.stringify(data);
    }

    let authToken = "";
    let beforeSend = null;
    if (localStorage.getItem("token")) {
        authToken = `Bearer ${localStorage.getItem("token")}`;
        beforeSend = (request) => request.setRequestHeader("Authorization", authToken);
    }

    $.ajax({
        type,
        url,
        contentType: "application/json",
        beforeSend,
        data,
        statusCode: {
            200(value) {
                if (typeof value === "object" && "redirect" in value) {
                    window.location = `${value.redirect}?redirect=${window.secretReactVars.BASE_URL}`;
                }
                returnFunc(value);
            },
            400(value) {
                value = { error: "Bad Request" };
                returnFunc(value);
            },
            401(xhr) {
                if (url.endsWith("/users/token/")) {
                    var value = { error: "Invalid Credentials" };
                    returnFunc(value);
                } else {
                    refresh_token(type, url, data, xhr.responseJSON, returnFunc);
                }
            },
            408(value) {
                var value = { error: "Request Timed Out" };
                returnFunc(value);
            },
        },
    });
}

function refresh_token(type, url, data, responseJSON, returnFunc) {
    if (url === "/users/user/" && responseJSON.code === "user_not_found") {
        clear_token();
        return false;
    }

    let refreshData = {};
    refreshData.csrfmiddlewaretoken = window.secretReactVars.csrfmiddlewaretoken;

    refreshData.refresh = "";
    if (localStorage.getItem("refresh_token")) {
        refreshData.refresh = localStorage.getItem("refresh_token");
    }

    refreshData = JSON.stringify(refreshData);

    // Revert data to JSON for POST and PUT requests
    if (type === "POST" || type === "PUT") {
        data = JSON.parse(data);
    }

    return $.ajax({
        type: "POST",
        url: "/users/token/refresh/",
        contentType: "application/json",
        data: refreshData,
        statusCode: {
            401(_xhr) {
                clear_token();
            },
            500(_xhr) {
                clear_token();
            },
        },
        success(value) {
            save_token(value);
            ajax_wrapper(type, url, data, returnFunc);
        },
        error(xhr, status, error) {
            handle_error(xhr, status, error);
            clear_token();
            // window.location.href = window.location.href;
        },
    });
}

function save_token(value) {
    localStorage.setItem("token", value.access);
    localStorage.setItem("refresh_token", value.refresh);
    localStorage.setItem("token_time", new Date());
}

function clear_token() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login/";
}

function handle_error(xhr, status, error) {
    //Error Handler
    console.log("Ajax Failure");
    console.log(xhr.responseText);
    console.log(status);
    console.log(error);
    //Error Handler
}

export { ajax_wrapper, save_token };