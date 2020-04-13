// function createDropDownCheckbox(placeId, filterName, val_data, checkboxClickListener, defaultText="Выбрать значение") {

//     let placeToPut = $(`#${placeId}`);

//     let nameStr = `filter${filterName}`;

//     let inputHtml = `<input name="${nameStr}" type="text"/>`;

//     placeToPut.append(inputHtml);

//     var input = $(`[name='${nameStr}']`);

//     // Создаем общий блок с классом
//     var val_cont = document.createElement('div');
//     let dropdownId = `dropdown${filterName}`;
//     $(val_cont).addClass("dropdown");
//     $(val_cont).attr('id', dropdownId);

//     // Создаем кнопку открытия списка и поле для записи значений
//     $(val_cont).append(`<a href='javascript:void(0);'><span class='open' id='open${dropdownId}'>${defaultText}</span><span class='value' id='val${dropdownId}'></span></a>`);

//     // Создаем выпдающий список и вкладываем в общий блок
//     var ul = document.createElement('ul');
//     let listElId = [];
//     for (let i = 0; i < val_data.length; i++) {
//         let elem = val_data[i];
//         let liId = dropdownId + elem.id;
//         listElId.push(liId);
//         $(ul).append(`<li><input type='checkbox' value='${elem.value}' id='${liId}'><label for='${liId}'>${elem.value}</label></li>`);
//     }
//     $(ul).appendTo(val_cont);
//     $(ul).hide();

//     // Размещаем общий блок после нужного input-а
//     $(input).after(val_cont);

//     // Скрываем/открываем выпадающий список
//     $(`#${dropdownId} a`).on('click', function() {
//         $(`#${dropdownId} ul`).slideToggle('fast');
//     });

//     $(`#${dropdownId} ul input[type="checkbox"]`).on('click', function() {
//         var title_val = $(this).closest(`#${dropdownId} ul`).find('input[type="checkbox"]').val(),
//             title = $(this).val() + ", ",
//             id = $(this).attr('id');
        
//         id = id.slice(dropdownId.length, id.length);
        
//         let ind = val_data.findIndex((element, index, array) => element.id == id);

//         checkboxClickListener(ind);

//         if ($(this).is(':checked')) {
//             var html = '<span data-atr="' + title + '">' + title + '</span>';
//             $(`#val${dropdownId}`).append(html);
//             $(`#open${dropdownId}`).hide();
//             val_data[ind].checked = true;
//         } else {
//             $(this).closest(`#${dropdownId}`).find('span[data-atr="' + title + '"]').remove();
//             val_data[ind].checked = false;
//         }

//         if ($(`#val${dropdownId}`).text() == "") {
//             $(`#open${dropdownId}`).show();
//             $(input).val("");
//         } else {
//             $(input).val($(`#val${dropdownId}`).text());
//         }
//     });
// }