import mongoose from "mongoose";

const nurseNoteSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    noteContent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const NurseNote = mongoose.model("NurseNote", nurseNoteSchema);
export default NurseNote;
