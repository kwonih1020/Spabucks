$(document).ready(function () {

    $('#membership').on('click', function () {
        $('#membership-popup').fadeIn(500);
    });

    $('.close-button').on('click', function () {
        $('#membership-popup').fadeOut(500);
    });

});

function is_id_satisfy(asValue) {
    let regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}

function is_nickname_satisfy(asValue) {
    let regExp = /^(?=.*[가-힣a-zA-Z])[-가-힣-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}

function is_password_satisfy(asValue) {
    let regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

function check_id() {
    let userId = $("#input-userId").val()
    console.log(userId)
    if (userId == "") {
        $("#help-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-userId").focus()
        return;
    }
    if (!is_id_satisfy(userId)) {
        $("#help-id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-userId").focus()
        return;
    }
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_id",
        data: {
            userId_give: userId
        },
        success: function (response) {

            if (response["exists"]) {
                $("#help-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-userId").focus()
            } else {
                $("#help-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-id").removeClass("is-loading")

        }
    });
}

function check_nickname() {
    let nickname = $("#input-nickname").val()

    if (nickname == "") {
        $("#help-nickname").text("닉네임을 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-nickname").focus()
        return;
    }
    if (!is_nickname_satisfy(nickname)) {
        $("#help-nickname").text("한글,영문,숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-nickname").focus()
        return;
    }

    $("#help-nickname").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_nickname",
        data: {
            nickname_give: nickname
        },
        success: function (response) {

            if (response["exists"]) {
                $("#help-nickname").text("이미 존재하는 닉네임입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-nickname").focus()
            } else {
                $("#help-nickname").text("사용할 수 있는 닉네임입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-nickname").removeClass("is-loading")

        }
    });
}

function sign_up() {
    let userId = $("#input-userId").val()
    let pw = $("#input-pw").val()
    let pw2 = $("#input-pw2").val()
    let nickname = $("#input-nickname").val()
    console.log(userId, nickname)


    if ($("#help-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) {
        alert("아이디 중복확인을 해주세요.")
        return;
    }

    if (pw == "") {
        $("#help-pw").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-pw").focus()
        return;
    } else if (!is_password_satisfy(pw)) {
        $("#help-pw").text("형식을 확인해 주세요.영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
        $("#input-pw").focus()
        return
    } else {
        $("#help-pw").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    }
    if (pw2 == "") {
        $("#help-pw").text("비밀번호를 재입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-pw2").focus()
        return;
    } else if (pw2 != pw) {
        $("#help-pw").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
        $("#input-pw2").focus()
        return;
    } else {
        $("#help-pw").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
    }
    $.ajax({
        type: "POST",
        url: "/sign_up/save",
        data: {
            userId_give: userId,
            password_give: pw,
            nickname_give: nickname
        },
        success: function (response) {
            alert("회원가입을 축하드립니다!")
            window.location.replace("/")
        }
    });
}

function request_signUp() {
    let cookies = document.cookie.split(';')
    let cookie_list = [];
    for (let i=0; i<cookies.length; i++) {
        cookie_list = cookies[i].split('=')
        if (cookie_list[0].includes("mytoken")) {
            window.location.href = "/maintain_login"
        } else {
            window.location.href = "/"
        }
}}

function caution() {
    alert("💁‍♂회원가입이 필요한 서비스입니다. 가입 후 이용해 주세요.")
    window.location.reload()
}
