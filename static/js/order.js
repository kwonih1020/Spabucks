$(document).ready(function (){
    showList()
})

function showList() {
    let placeHtml = getPlace()
    let menuHtml = getMenu()
    maxRows = Math.max(placeHtml.length, menuHtml.length)

    console.log(placeHtml.length)
    console.log(menuHtml.length)
    console.log(maxRows)
    let html = []
    for (let i = 0; i < maxRows; i++) {
        let place = placeHtml[i]
        let menu = menuHtml[i]

        if (place==null) {
            place = ``
        }
        if (menu==null) {
            menu = ``
        }
        html.push([place, menu])
        
    }
    console.log(html.length)

    for (let i = 0; i < html.length; i++) {
        let element = html[i];
        let temp_html = `<tr>
                            <td>${element[0]}</td>
                            <td>
                                <div class="d-flex align-content-center">
                                    ${element[1]}
                                </div>
                            </td>
                        </tr>`
        $('#menuList').append(temp_html);
    }
    
}

function getPlace() {
    let placeHtml = new Array()
    $.ajax({
        type: "GET",
        url: "/place",
        data: {},
        async: false,
        success: function (response) {
            let element
            for (let i = 0; i < response['places'].length; i++) {
                element = response['places'][i];
                // console.log(element)
                let placeName = element['storeName']
                let placeAddress = element['storeAddress']
                let placeImage = 'static/images/place_image.jpeg'

                let temp_html = `
                            <div class="card mb-3">
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
        }
    });
    return placeHtml
}

function getMenu() {
    let menuHtml = new Array()
    $.ajax({
        type: "GET",
        url: "/menu",
        data: {},
        async: false,
        success: function (response) {
            console.log(response)
            let element
            for (let i = 0; i < response['menus'].length; i++) {
                element = response['menus'][i];
                let menuName = element['productName']
                let menuImage = element['image']
                console.log(menuImage)
                let menuCost = element['cost']

                let temp_html = `
                            <div class="card mb-3"">
                                <div class="row g-0">
                                        <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input">
                                    <div class="col-md-4">
                                        <img src="${menuImage}" class="img-fluid rounded-start" alt="...">
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
        }
    });
    return menuHtml
}

function orderComplete() {
    location.href = '/pay'
}