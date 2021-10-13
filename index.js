let persons = [];


$('form').on('submit', function (event) {
    event.preventDefault();

    let data = $('form').serializeArray();

    let person = { index: new Date().getTime(), name: data[0].value, email: data[1].value }

    if ($('input[type=hidden]', $(this)).length) {
        let item = persons.find(item => {
            return item.index === parseInt($('input[type=hidden]').val())
        });
        item.name = person.name;
        item.email = person.email;
    } else {
        persons.push(person);
    }

    render();

    $('form input[type=hidden]').remove();
})

let render = () => {
    let tbodyContent = '';
    persons.forEach(person => {
        tbodyContent += `<tr>
        <td>${person.index}</td>
        <td>${person.name}</td>
        <td>${person.email}</td>
        <td>
            <button class="edit-button" data-id='${person.index}'>Modifier</button>
            <button class="delete-button" data-id='${person.index}'>Supprimer</button>
        </td>
    </tr>`
    })
    $('tbody').html(tbodyContent);

    $(`.delete-button`).off().on('click', function () {
        deleteItem($(this).data('id'));
    })

    $(`.edit-button`).off().on('click', function () {
        editItem($(this).data('id'));
    })
}

let deleteItem = (id) => {
    persons = persons.filter(person => person.index !== id)

    render();
}

let editItem = (id) => {
    let person = persons.find(person => person.index === id);

    $('form input[name=name]').val(person.name);
    $('form input[name=email]').val(person.email);

    $('form input[type=hidden]').remove();
    $('form').append(`<input type="hidden" value="${person.index}">`);
}

/**
 * @todo à chaque soumission du formulaire, mettre les données soumis
 *       dans un tableau HTML avant le formulaire
 * @todo Je dois pouvoir supprimer une ligne de mon tableau
 * @todo je dois pouvoir modifier une ligne dans mon tableu
 */

fetch('/persons.json')
    .then(response => {
        response.json().then(remotePersons => {
            persons = [...remotePersons];
            console.log(persons);
            render()
        })
    })

render();