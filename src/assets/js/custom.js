$(document).ready(function() {
    $("#example,#example1,#example2,#example3").DataTable();
  });

$(function () {
    // add multiple select / deselect functionality
    $("#selectall,#selectall1,#selectall2,#selectall3").click(function () {
        $('.name').attr('checked', this.checked);
    });

    // if all checkbox are selected, then check the select all checkbox
    // and viceversa
    $(".name").click(function () {

        if ($(".name").length == $(".name:checked").length) {
            $("#selectall,#selectall1,#selectall2,#selectall3").attr("checked", "checked");
        } else {
            $("#selectall,#selectall1,#selectall2,#selectall3").removeAttr("checked");
        }

    });
});

$(document).ready(function() {
    $('.static_content_menu li a').click(function() {
        var $this = $(this).attr('data-tag');
        $('.static_content_menu li a').parent('li').removeClass('active');
        $(this).parent('li').addClass('active');
        $('.content').hide().removeClass('show');
        $('#' + $this).show();
    });


    $('.selectAll_checkbox').on('click',function() {
        if($(this).is(':checked')) {
            $(this).parents('li').nextAll('li').find('input').prop('checked',true);
        }else {
            $(this).parents('li').nextAll('li').find('input').prop('checked',false);
        }
    });

    $('.Multiple label input.options').on('click', function() {
        var inputsLen = $('.Multiple label input.options').length;
        if($('.Multiple label input.options:checked').length < inputsLen) {
            $('.selectAll_checkbox').prop('checked',false);
        }else {
            $('.selectAll_checkbox').prop('checked',true); 
        }
    });

    // block and unblock user
    $('.blockUnblock_btn input').on('change',function() {
        if($(this).is(':checked')) {
            $('#blockModal').modal({show:'false'}); 
        }else {
            $('#unblockModal').modal({show:'false'});
        }
    })

    // enable and disable user
    $('.enableDisable_btn input').on('change',function() {
        if($(this).is(':checked')) {
            $('#disableModal').modal({show:'false'}); 
        }else {
            $('#enableModal').modal({show:'false'});
        }
    });


    // sidebar collpase and expande
    // $('.SidenavBar').on('mouseenter',function() {
    //     $(this).addClass('SidenavBar_expende');
    //     $('.WrapperArea').addClass('margin_left');
    // });

    // $('.SidenavBar').on('mouseleave',function() {
    //     $(this).removeClass('SidenavBar_expende');
    //     $('.WrapperArea').removeClass('margin_left');
    // });


    // number counter on dashboard page`
    $('.count').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 3000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
})


$(document).on('click' ,'.labelClick' ,function(){
    if($('.setTo').hasClass('active')){
 $('.setTo').removeClass('active');
    }
    else{
        $('.setTo').addClass('active');     
    }
});

