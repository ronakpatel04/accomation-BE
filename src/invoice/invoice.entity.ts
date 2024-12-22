import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { InvoiceItem } from "./invoice-item.entity";

@Entity("invoice")
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromName: string;

  @Column()
  fromAddress: string;

  @Column()
  toName: string;

  @Column()
  toAddress: string;

  @Column({ type: "date" })
  invoiceDate: Date;

  
  @Column({ unique: true }) 
  invoiceNumber: string; 


  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items: InvoiceItem[];
}
