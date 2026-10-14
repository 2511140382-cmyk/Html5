import './MiBoton.css'
function MiBoton() {
  const descargarCV = () => {
    const urlPDF = '/cv_simple-Bautista.pdf';
    const enlace = document.createElement('a');
    enlace.href = urlPDF;
    enlace.download = 'cv_simple-Bautista.pdf';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  };

  return (
    <button className="btn-descargar" onClick={descargarCV} style={{color:'red'}}>
      📄 Descargar CV
    </button>
  );
}

export default MiBoton;