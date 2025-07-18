function calcularGratificacion() {
  const salario = parseFloat(document.getElementById('salario').value);
  const fechaInicioStr = document.getElementById('fechaInicio').value;
  const tipoGratificacion = document.getElementById('tipoGratificacion').value;
  const regimen = document.getElementById('regimen').value;
  const asignacionFamiliar = document.getElementById('asignacionFamiliar').value;

  // Validación visual
  resetFieldStyles();
  let errores = false;
  if (!fechaInicioStr) {
    document.getElementById('fechaInicio').classList.add('input-error');
    errores = true;
  }
  if (isNaN(salario) || salario <= 0) {
    document.getElementById('salario').classList.add('input-error');
    errores = true;
  }
  if (errores) {
    alert("Por favor, complete todos los campos obligatorios correctamente.");
    return;
  }

  const fechaInicio = new Date(fechaInicioStr);
  const anio = new Date().getFullYear();

  const fechaCorte = tipoGratificacion === 'fiestas'
    ? new Date(anio, 5, 30)
    : new Date(anio, 11, 31);

  // ⚠️ Mantenemos solo esta validación
  if (fechaInicio > fechaCorte) {
    document.getElementById('mesesTrabajados').value = '0';
    mostrarResultado(0, 0, 0, 0);
    return;
  }

  let meses = (fechaCorte.getFullYear() - fechaInicio.getFullYear()) * 12;
  meses += fechaCorte.getMonth() - fechaInicio.getMonth();

  const dias = fechaCorte.getDate() - fechaInicio.getDate() + 1;
  const fraccionMes = dias > 0 ? dias / 30 : 0;
  let mesesTrabajados = Math.min((meses + fraccionMes), 6);
  mesesTrabajados = Math.round(mesesTrabajados * 100) / 100;

  document.getElementById('mesesTrabajados').value = mesesTrabajados;

  if (regimen === 'micro') {
    mostrarMensaje("No tiene derecho a gratificación bajo el Régimen de Micro Empresa.");
    return;
  }

  const gratificacion = (salario / 6) * mesesTrabajados;
  const bonificacionAsigFamiliar = asignacionFamiliar === 'si' ? 113 : 0;
  const baseBonificacion = gratificacion + bonificacionAsigFamiliar;
  const bonificacionEssalud = regimen === 'general' ? baseBonificacion * 0.09 : 0;
  const total = gratificacion + bonificacionEssalud + bonificacionAsigFamiliar;

  mostrarResultado(gratificacion, bonificacionEssalud, bonificacionAsigFamiliar, total);
}

function mostrarResultado(gratificacion, bonificacionEssalud, asignacionFamiliar, total) {
  let html = `<p><strong>Gratificación:</strong> S/ ${gratificacion.toFixed(2)}</p>`;
  if (bonificacionEssalud > 0) {
    html += `<p><strong>Bonif. Extraord. (Essalud 9%):</strong> S/ ${bonificacionEssalud.toFixed(2)}</p>`;
  }
  if (asignacionFamiliar > 0) {
    html += `<p><strong>Bonif. Asig. Familiar:</strong> S/ ${asignacionFamiliar.toFixed(2)}</p>`;
  }
  html += `<p><strong>TOTAL A PAGAR:</strong> S/ ${total.toFixed(2)}</p>`;
  document.getElementById('resultado').innerHTML = html;
}

function mostrarMensaje(mensaje) {
  document.getElementById('resultado').innerHTML = `
    <p style="color:red;"><strong>${mensaje}</strong></p>
  `;
}

function reiniciarFormulario() {
  document.getElementById('fechaInicio').value = '';
  document.getElementById('salario').value = '';
  document.getElementById('mesesTrabajados').value = '';
  document.getElementById('tipoGratificacion').selectedIndex = 0;
  document.getElementById('regimen').selectedIndex = 0;
  document.getElementById('asignacionFamiliar').selectedIndex = 0;
  resetFieldStyles();
  mostrarResultado(0, 0, 0, 0);
}

function resetFieldStyles() {
  document.getElementById('fechaInicio').classList.remove('input-error');
  document.getElementById('salario').classList.remove('input-error');
}
