var show = document.getElementsByClassName('show'),
    hide = document.getElementsByClassName('hide'),
    form = document.getElementsByClassName('form_comment');

for (let i = 0; i < show.length; i++) {
    show[i].addEventListener('click', function() {
        hide[i].style = ('display: block');
        form[i].style = ('display: block');
        show[i].disabled = true;
    });
    hide[i].addEventListener('click', function() {
        form[i].style = ('display: none');
        show[i].disabled = false;
        hide[i].style = ('display: none');
    });
}
