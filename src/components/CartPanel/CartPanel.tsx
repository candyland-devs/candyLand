import { useCart } from "../../context/CartContext";
import styles from "./CartPanel.module.css";

interface CartPanelProps {
  abierto: boolean;
  cerrar: () => void;
}

export default function CartPanel({ abierto, cerrar }: CartPanelProps) {
  const { cart, removeItem, total, sendOrder } = useCart();

  return (
    <div className={`${styles.panel} ${abierto ? styles.abierto : ""}`}>
      <div className={styles.header}>
        <span>🛒 Tu carrito</span>
        <span className={styles.cerrar} onClick={cerrar}>✖</span>
      </div>

      <div className={styles.lista}>
        {cart.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#999" }}>
            Carrito vacío
          </p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <div>
                <p>{item.name}</p>
                <p style={{ color: "#666" }}>
                  ${item.price} x {item.quantity}
                </p>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ color: "#e74c3c", cursor: "pointer" }}>
                Quitar
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className={styles.total}>
          <p>Total: ${total}</p>
          <button className={styles.boton} onClick={sendOrder}>
            Finalizar compra
          </button>
        </div>
      )}
    </div>
  );
}
