import Consultation from "../models/consultation.model.js";

export const createConsultation = async (req, res) => {
  try {
    const { patientId, appointmentId, diagnosis, symptoms, prescriptions, recommendations, followUpDate, notes } = req.body;
    const doctorId = req.user._id;

    const consultation = new Consultation({
      doctorId,
      patientId,
      appointmentId: appointmentId || null,
      diagnosis,
      symptoms,
      prescriptions,
      recommendations,
      followUpDate,
      notes,
    });

    const savedConsultation = await consultation.save();
    res.status(201).json(savedConsultation);
  } catch (error) {
    console.error("Error in createConsultation: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user._id;

    const consultation = await Consultation.findOneAndUpdate(
      { _id: id, doctorId },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (!consultation) return res.status(404).json({ message: "Consultation not found" });

    res.status(200).json(consultation);
  } catch (error) {
    console.error("Error in updateConsultation: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user._id;

    const consultation = await Consultation.findOneAndDelete({ _id: id, doctorId });
    if (!consultation) return res.status(404).json({ message: "Consultation not found" });

    res.status(200).json({ message: "Consultation deleted", id });
  } catch (error) {
    console.error("Error in deleteConsultation: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};
