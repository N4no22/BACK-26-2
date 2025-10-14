import ArqueoCaja from '../models/arqueo_caja.model.js';

// Abrir arqueo
// Abrir un nuevo arqueo
export const abrirArqueo = async (req, res) => {
  const { usuario_id, saldo_anterior } = req.body; // saldo_anterior opcional
  try {
    const arqueo = await ArqueoCaja.abrirArqueo(usuario_id, saldo_anterior);
    res.status(201).json(arqueo);
  } catch (err) {
    res.status(500).json({ message: 'Error al abrir el arqueo', error: err.message });
  }
}

// Cerrar arqueo
export const cerrarArqueo = async (req, res) => {
  try {
    const usuario_id = req.body.usuario_id;
    const arqueo = await ArqueoCaja.cerrarArqueo(usuario_id);
    res.status(200).json(arqueo);
  } catch (err) {
    res.status(500).json({ message: 'Error al cerrar arqueo', error: err.message });
  }
};

// Mantener resto de endpoints CRUD
export const getAllArqueos = async (req, res) => {
  try {
    const arqueos = await ArqueoCaja.getAll();
    res.status(200).json(arqueos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener arqueos', error: err.message });
  }
};

export const getArqueoById = async (req, res) => {
  const { id } = req.params;
  try {
    const arqueo = await ArqueoCaja.getById(id);
    if (arqueo) res.status(200).json(arqueo);
    else res.status(404).json({ message: 'Arqueo no encontrado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener arqueo', error: err.message });
  }
};
