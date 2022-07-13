$(document).ready(function () {
    showList()
})

function showList() {
    let placeHtml = getPlace()
    let menuHtml = getMenu()
    maxRows = Math.max(placeHtml.length, menuHtml.length)

    let html = []
    for (let i = 0; i < maxRows; i++) {
        let place = placeHtml[i]
        let menu = menuHtml[i]

        if (place == null) {
            place = ``
        }
        if (menu == null) {
            menu = ``
        }
        html.push([place, menu])
    }

    for (let i = 0; i < html.length; i++) {
        let element = html[i];
        let temp_html = `<tr class="container">
                            <td class="place-table">${element[0]}</td>
                            <td>${element[1]}</td>
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
                let placeName = element['storeName']
                let placeAddress = element['storeAddress']
                let placeImage = 'static/images/place_image.jpeg'

                let temp_html = `<div class="card mb-3">
                                    <div class="row">
                                        <input class="form-check-input mt-0 menu-checkbox" type="radio" value='${JSON.stringify(element)}' name="placeRadio">
                                        <div class="col-md-4">
                                            <img src=${placeImage} class="img-fluid rounded-start" alt="...">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body place-info">
                                                <h5 class="card-title">${placeName}</h5>
                                                <p class="card-text">${placeAddress}</p>
                                            </div>
                                    </div>
                                </div>`
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
            let element
            for (let i = 0; i < response['menus'].length; i++) {
                element = response['menus'][i];
                let kind = element['kind']
                let menuName = element['productName']
                let menuImage = element['image']
                let menuCost = element['cost']
                let temp = element['temp']
                let size = element['size']


                let option_html
                if (kind=='beverages'){

                    let defaultData = function () {return {'activation':'disabled', 'addCost':'구매불가'}}
                    let tempData = {'ICE':defaultData(), 
                                    'HOT':defaultData()}
                    for (let i = 0; i < temp.length; i++) {
                        const element = temp[i];
                        if (element['addCost']==0){
                            tempData[element['temp']]['addCost'] = ""
                        }else{
                            tempData[element['temp']]['addCost'] = `+${element['addCost']}`
                        }
                        tempData[element['temp']]['activation'] = 'enabled'
                    }

                    let sizeData = {'TALL':defaultData(), 
                                    'GRANDE':defaultData(), 
                                    'VENTI':defaultData()}
                    for (let i = 0; i < size.length; i++) {
                        const element = size[i];
                        if (element['addCost']==0){
                            sizeData[element['size']]['addCost'] = ""
                        }else{
                            sizeData[element['size']]['addCost'] = `+${element['addCost']}`
                        }
                        sizeData[element['size']]['activation'] = 'enabled'
                    }

                    option_html =` 
                                        <div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="${menuName}tempSelector" id="${menuName}ICE" ${tempData['ICE']['activation']}>
                                            <label class="form-check-label" for="tempSelector1">
                                                ICE ${tempData['ICE']['addCost']}
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="${menuName}tempSelector" id="${menuName}HOT" ${tempData['HOT']['activation']}>
                                            <label class="form-check-label" for="tempSelector2">
                                                HOT ${tempData['HOT']['addCost']}
                                            </label>
                                        </div>
                                        </div>

                                        <div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="${menuName}sizeSelector" id="${menuName}TALL" value="${sizeData['TALL']['addCost']}" ${sizeData['TALL']['activation']}>
                                            <label class="form-check-label" for="sizeSelector1">
                                                TALL ${sizeData['TALL']['addCost']}
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="${menuName}sizeSelector" id="${menuName}GRANDE" value="${sizeData['GRANDE']['addCost']}" ${sizeData['GRANDE']['activation']}>
                                            <label class="form-check-label" for="sizeSelector2">
                                                GRANDE ${sizeData['GRANDE']['addCost']}
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="${menuName}sizeSelector" id="${menuName}VENTI" value="${sizeData['VENTI']['addCost']}" ${sizeData['VENTI']['activation']}>
                                            <label class="form-check-label" for="sizeSelector3">
                                                VENTI ${sizeData['VENTI']['addCost']}
                                            </label>
                                        </div>
                                        </div>
                                        `}
                    else{option_html=``}

                // activateIce = 

                let temp_html = `<div class="card mb-3"">
                                    <div class="row">
                                        <input class="form-check-input mt-0 menu-checkbox" type="checkbox" value='${JSON.stringify(element)}' aria-label="Checkbox for following text input" name="menuCheckbox">
                                        <div class="col-md-4 menu-image">
                                            <img src="${menuImage}" class="img-fluid rounded-start" alt="...">
                                        </div>
                                        <div class="col-md-8 menu-card">
                                            <div class="card-body">
                                                <p class="card-title">${menuName}</p>
                                                <p class="card-text">${menuCost}</p>
                                                ${option_html}
                                                <input type="number" id="${menuName}" name="count" min="0" max="100" value="0">
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                menuHtml.push(temp_html)
            }
        }
    });
    return menuHtml
}

function orderComplete() {
    let place
    $('input:radio[name="placeRadio"]').each(function () {
        if(this.checked){
            place=JSON.parse(this.value)
        }
      })
    let orders = []
    $('input:checkbox[name="menuCheckbox"]').each(function () {
        if(this.checked){
            let data = JSON.parse(this.value)
            let count = parseInt(document.getElementById(data['productName']).value)
            if (count!=0){
                data['count'] = count
                data['cost'] = data['count']*data['cost']
                data['size'] = 'tall'
                data['temp'] = 'ice'
                orders.push(data)
            }
        }
      })
    let result = {"place":place, "order":orders}
    console.log(result)
    localStorage.setItem("orders",JSON.stringify(result))
    // location.href = ‘/pay’
}