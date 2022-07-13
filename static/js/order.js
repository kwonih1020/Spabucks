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
                                         <div class="col-md-4">
                                            <img src=${placeImage} class="img-fluid rounded-start" alt="...">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="place-info">
                                                <h5 class="card-title">${placeName}</h5>
                                                <p class="card-text">${placeAddress}</p>
                                                <input class="form-check-input mt-0 menu-checkbox" type="radio" value='${JSON.stringify(element)}' name="placeRadio">
                                            </div>
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
                if (kind=='beverages') {

                    let defaultData = function (val) {return {key:val,'activation':'disabled', 'addCostStr':'구매불가', 'addCost':0}}
                    let tempData = {'ICE':defaultData('ICE'), 
                                    'HOT':defaultData('HOT')}
                    for (let i = 0; i < temp.length; i++) {
                        const element = temp[i];
                        if (element['addCost']==0){
                            tempData[element['temp']]['addCostStr'] = ""
                        } else{
                            tempData[element['temp']]['addCostStr'] = `+${element['addCost']}`
                            tempData[element['temp']]['addCost'] = element['addCost']
                        }
                        tempData[element['temp']]['activation'] = 'enabled'
                    }

                    let sizeData = {'TALL':defaultData('TALL'), 
                                    'GRANDE':defaultData('GRANDE'), 
                                    'VENTI':defaultData('VENTI')}
                    for (let i = 0; i < size.length; i++) {
                        const element = size[i];
                        if (element['addCost']==0){
                            sizeData[element['size']]['addCostStr'] = ""
                        } else{
                            sizeData[element['size']]['addCostStr'] = `+${element['addCost']}`
                            sizeData[element['size']]['addCost'] = element['addCost']
                        }
                        sizeData[element['size']]['activation'] = 'enabled'
                    }

                    option_html =`  <div class="dropdown-group">
                                          <select class="form-check" id="${menuName}TempSelector">
                                                <option  disabled selected>TEMP</option>
                                                <option class="" value='${JSON.stringify(tempData['ICE'])}' ${tempData['ICE']['activation']}>ICE ${tempData['ICE']['addCostStr']}</option>
                                                <option class="" value='${JSON.stringify(tempData['HOT'])}' ${tempData['HOT']['activation']}>HOT ${tempData['HOT']['addCostStr']}</option>
                                          </select>
                                          <select class="form-check" id="${menuName}SizeSelector">
                                                <option  disabled selected>SIZE</option>
                                                <option class="" value='${JSON.stringify(sizeData['TALL'])}' ${sizeData['TALL']['activation']}>TALL ${sizeData['TALL']['addCostStr']}</option>
                                                <option class="" value='${JSON.stringify(sizeData['GRANDE'])}' ${sizeData['GRANDE']['activation']}>GRANDE ${sizeData['GRANDE']['addCostStr']}</option>
                                                <option class="" value='${JSON.stringify(sizeData['VENTI'])}' ${sizeData['VENTI']['activation']}>VENTI ${sizeData['VENTI']['addCostStr']}</option>
                                          </select>
                                    </div>`
                } else {
                    option_html=``
                }

                // activateIce = 

                let temp_html = `<div class="card mb-3"">
                                    <div class="row">
                                        <div class="col-md-4 menu-image">
                                            <img src="${menuImage}" class="img-fluid rounded-start" alt="...">
                                        </div>
                                        <div class="col-md-8 menu-card">
                                            <div class="card-body">
                                                <p class="card-title">${menuName}</p>
                                                <input class="form-check-input mt-0 menu-checkbox" type="checkbox" value='${JSON.stringify(element)}' aria-label="Checkbox for following text input" name="menuCheckbox">
                                            </div>
                                            <div class="card-bottom">
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
    if(place==null){
        alert("주문하실 지점을 선택하세요")
    }

    let orders = []
    $('input:checkbox[name="menuCheckbox"]').each(function () {
        if(this.checked){
            let data = JSON.parse(this.value)
            let count = parseInt(document.getElementById(data['productName']).value)
            if (count!=0){
                try {
                    let tempData
                    let sizeData
                    let addCost = 0
                    if(data['kind']=='beverages'){
                        tempData = JSON.parse(document.getElementById(`${data['productName']}TempSelector`).value)
                        sizeData = JSON.parse(document.getElementById(`${data['productName']}SizeSelector`).value)
                        data['size'] = sizeData['key']
                        data['temp'] = tempData['key']
                        addCost = sizeData['addCost']+tempData['addCost']
                    }
                    data['count'] = count
                    data['cost'] = (data['cost']+addCost)*data['count']
                    orders.push(data)
                } catch (error) {
                    alert('음료의 온도와 크기를 선택해 주세요')
                }
            }
        }
    })
    if(orders.length==0){
        alert("제품을 1개 이상 선택해 주세요.")
    }
    if (orders.length!=0 & place!=null){
        let result = {"place":place, "order":orders}
        page_move(result)
    }
}

function page_move(orders) {
    let data = JSON.stringify(orders)
    $.cookie('orderList', data, {path: '/'});
    location.href = '/pay'
}