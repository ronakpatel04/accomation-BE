import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Invoice } from "./invoice.entity";

@Entity("invoice_item")
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemName: string;

  @Column()
  quantity: number;

  @Column({ type: "decimal" })
  rate: number;

  @Column({ type: "decimal" })
  total: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: "CASCADE" })
  invoice: Invoice;
}
