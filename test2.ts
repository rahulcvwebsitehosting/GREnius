import { Chess } from "chess.js";
const chess = new Chess();
try {
  chess.move({ from: "e2", to: "e4", promotion: "q" });
  console.log("Success with promotion: q for e2-e4");
} catch(e) {
  console.log("Error with promotion: q for e2-e4", e.message);
}
