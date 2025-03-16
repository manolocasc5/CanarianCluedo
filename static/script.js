document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is ready!');
});

function ejecutarSQL() {
    const query = document.getElementById('sql-query').value;
    const resultDiv = document.getElementById('sql-result');

    resultDiv.innerHTML = '<p>Ejecutando consulta...</p>';

    fetch('/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: query })
    })
    .then(response => response.json())
    .then(data => {
        resultDiv.innerHTML = '';
        if (data.success) {
            if (data.result.length > 0) {
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');
                const headerRow = document.createElement('tr');

                data.columns.forEach(column => {
                    const th = document.createElement('th');
                    th.textContent = column;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                data.result.forEach(row => {
                    const tr = document.createElement('tr');
                    row.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);
                resultDiv.appendChild(table);
            } else {
                resultDiv.innerHTML = '<p>La consulta se ejecutó correctamente, pero no devolvió resultados.</p>';
            }
        } else {
            resultDiv.innerHTML = `<p style="color: red;">Error al ejecutar la consulta: ${data.error}</p>`;
        }
    })
    .catch(error => {
        resultDiv.innerHTML = `<p style="color: red;">Error de red: ${error}</p>`;
    });
}

function verificarRespuesta(campo, respuestaCorrecta, resultadoId) {
    let respuestaUsuario = document.getElementById(campo).value;
    let resultadoElement = document.getElementById(resultadoId);

    if (respuestaUsuario.trim().toLowerCase() === respuestaCorrecta.toLowerCase()) {
        resultadoElement.textContent = "¡Correcto!";
        resultadoElement.style.color = "green";
    } else {
        resultadoElement.textContent = "Incorrecto. Inténtalo de nuevo.";
        resultadoElement.style.color = "red";
    }
}
