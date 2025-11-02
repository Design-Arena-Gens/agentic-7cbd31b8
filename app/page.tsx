"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type Item = {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

const initialItems: Item[] = [
  {
    id: 1,
    description:
      "Mantenimiento de estructuras metálicas con pintura anticorrosiva y preparación de superficie.",
    quantity: 2,
    unitPrice: 180.5,
    discount: 5
  },
  {
    id: 2,
    description:
      "Suministro e instalación de luminarias LED industriales de alta eficiencia.",
    quantity: 8,
    unitPrice: 95.25,
    discount: 0
  }
];

function formatCurrency(value: number) {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR"
  });
}

export default function Page() {
  const [items, setItems] = useState<Item[]>(initialItems);

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, item) => {
      const discountFactor = 1 - item.discount / 100;
      return acc + item.quantity * item.unitPrice * discountFactor;
    }, 0);

    return {
      subtotal,
      tax: subtotal * 0.21,
      total: subtotal * 1.21
    };
  }, [items]);

  const updateItem = <K extends keyof Item>(
    id: number,
    key: K,
    value: Item[K]
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const handleChange = (
    id: number,
    key: "description" | "quantity" | "unitPrice" | "discount",
    value: string
  ) => {
    switch (key) {
      case "description":
        updateItem(id, key, value);
        break;
      case "quantity":
      case "unitPrice":
      case "discount":
        updateItem(id, key, Number(value));
        break;
    }
  };

  const addItem = () => {
    const nextId = items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    setItems((prev) => [
      ...prev,
      {
        id: nextId,
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0
      }
    ]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className={styles.main}>
      <section className={styles.panel}>
        <header className={styles.panelHeader}>
          <div>
            <h1 className={styles.title}>Ítems del Documento</h1>
            <p className={styles.subtitle}>
              Optimiza la captura de partidas y evita desbordamientos o
              solapamientos en cualquier tamaño de pantalla.
            </p>
          </div>
          <button className={styles.addButton} onClick={addItem}>
            Añadir línea
          </button>
        </header>

        <div className={styles.tableWrapper}>
          <div className={styles.tableHead} aria-hidden="true">
            <span>#</span>
            <span>Descripción</span>
            <span>Cant.</span>
            <span>Precio Unit.</span>
            <span>Desc. %</span>
            <span>Subtotal</span>
            <span />
          </div>

          <div className={styles.itemsContainer}>
            {items.map((item) => {
              const subtotal =
                item.quantity * item.unitPrice * (1 - item.discount / 100);

              return (
                <article className={styles.itemCard} key={item.id}>
                  <header className={styles.itemHeader}>
                    <span className={styles.itemBadge}>Línea {item.id}</span>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => removeItem(item.id)}
                      aria-label={`Eliminar línea ${item.id}`}
                    >
                      ×
                    </button>
                  </header>

                  <div className={styles.itemGrid}>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>#</span>
                      <input
                        type="number"
                        className={styles.fieldInput}
                        value={item.id}
                        disabled
                      />
                    </label>

                    <label className={`${styles.field} ${styles.fieldWide}`}>
                      <span className={styles.fieldLabel}>Descripción</span>
                      <textarea
                        className={`${styles.fieldInput} ${styles.descriptionInput}`}
                        placeholder="Ej: Mantenimiento de estructuras metálicas con pintura anticorrosiva"
                        aria-label={`Descripción línea ${item.id}`}
                        rows={3}
                        value={item.description}
                        onChange={(event) =>
                          handleChange(item.id, "description", event.target.value)
                        }
                      />
                    </label>

                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Cant.</span>
                      <input
                        type="number"
                        className={styles.fieldInput}
                        min={0}
                        step={1}
                        value={item.quantity}
                        onChange={(event) =>
                          handleChange(item.id, "quantity", event.target.value)
                        }
                      />
                    </label>

                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Precio Unit.</span>
                      <input
                        type="number"
                        className={styles.fieldInput}
                        min={0}
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(event) =>
                          handleChange(item.id, "unitPrice", event.target.value)
                        }
                      />
                    </label>

                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Desc. %</span>
                      <input
                        type="number"
                        className={styles.fieldInput}
                        min={0}
                        max={100}
                        step="0.5"
                        value={item.discount}
                        onChange={(event) =>
                          handleChange(item.id, "discount", event.target.value)
                        }
                      />
                    </label>

                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Subtotal</span>
                      <output className={styles.subtotalOutput}>
                        {formatCurrency(subtotal)}
                      </output>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <aside className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>Resumen</h2>
        <dl className={styles.summaryList}>
          <div className={styles.summaryRow}>
            <dt>Subtotal</dt>
            <dd>{formatCurrency(totals.subtotal)}</dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>IVA 21%</dt>
            <dd>{formatCurrency(totals.tax)}</dd>
          </div>
          <div className={styles.summaryRowTotal}>
            <dt>Total</dt>
            <dd>{formatCurrency(totals.total)}</dd>
          </div>
        </dl>
      </aside>
    </main>
  );
}
