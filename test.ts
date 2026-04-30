import { Chess } from "chess.js";
const chess = new Chess();
try {
  const move = chess.move({ from: "e2", to: "e4", promotion: "q" });
  console.log("Success", move);
} catch (e) {
  console.error("Error:", e.message);
}
