$(document).ready(function () {

    $('#log_in').on('click', function () {
        $('#sign-popup').fadeIn(500);
    });

    $('.close-button').on('click', function () {
        $('#sign-popup').fadeOut(500);
    });
});

    function sign_in() {
        let userId = $("#login-id").val()
        let pw = $("#login-pw").val()

        if (userId == "") {
            $("#help-id-login").text("아이디를 입력해주세요.")
            $("#login-id").focus()
            return;
        } else {
            $("#help-id-login").text("")
        }

        if (pw == "") {
            $("#help-id-login").text("비밀번호를 입력해주세요.")
            $("#login-pw").focus()
            return;
        } else {
            $("#help-id-login").text("")
        }
        $.ajax({
            type: "POST",
            url: "/sign_in",
            data: {
                userId_give: userId,
                password_give: pw
            },
            success: function (response) {
                if (response['result'] == 'success') {
                    $.cookie('mytoken', response['token'], {path: '/'});
                    alert("환영합니다." + userId + "님")
                    {
                        // window.location.replace("/order");

                    }

                } else {
                    alert(response['msg'])
                }
            }
        });
    }

