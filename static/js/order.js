$(document).ready(function (){
    showList()
})

function showList() {
    let placeHtml = getPlace()
    let menuHtml = getMenu()

    let html = placeHtml.map(function (e, i) {return [e,menuHtml[i]] })

    for (let i = 0; i < html.length; i++) {
        let element = html[i];
        let temp_html = `<tr>
                            <td>${element[0]}</td>
                            <td>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                    <label class="form-check-label" for="flexCheckDefault" style="width:500px">
                                        ${element[1]}
                                    </label>
                                </div>
                            </td>
                        </tr>`
        $('#menuList').append(temp_html);
    }
    
}

        let temp_html = `

function getPlace() {
    $.ajax({
        type: "GET",
        url: "/place",
        data: {},
        dataType: "dataType",
        success: function (response) {
            let element
            let placeHtml = []
            for (let i = 0; i < response.length; i++) {
                element = response[i];
                let placeName = response['name']
                let placeAddress = response['address']
                let placeImage = response['image']

                let temp_html = `
                            <div class="card mb-3" style="max-width: 300px;">
                                <div class="row g-0">
                                    <div class="col-md-4">
                                        <img src=${placeImage} class="img-fluid rounded-start" alt="...">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">${placeName}</h5>
                                            <p class="card-text">${placeAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `
                
                placeHtml.push(temp_html)
            }
            return placeHtml
        }
    });
}

function getMenu() {
    $.ajax({
        type: "GET",
        url: "/menu",
        data: {},
        success: function (response) {
            let element
            let menuHtml = []
            for (let i = 0; i < response.length; i++) {
                element = response[i];
                let menuName = response['name']
                let menuImage = response['image']
                let menuCost = response['cost']

                let temp_html = `
                            <div class="card mb-3" style="max-width: 300px;">
                                <div class="row g-0">
                                    <div class="col-md-4">
                                        <img src=${menuImage} class="img-fluid rounded-start" alt="...">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">${menuName}</h5>
                                            <p class="card-text">${menuCost}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `
                
                menuHtml.push(temp_html)
            }
            return menuHtml
        }
    });
    
}