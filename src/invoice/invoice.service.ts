import { Injectable } from '@nestjs/common';
import { Invoice } from './invoice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceItem } from './invoice-item.entity';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
      ) {}
    
      async createInvoice(data: any): Promise<Invoice> {
        const { fromName, fromAddress, toName, toAddress, invoiceDate, items } =
          data;
    
        const invoice = new Invoice();
        invoice.fromName = fromName;
        invoice.fromAddress = fromAddress;
        invoice.toName = toName;
        invoice.toAddress = toAddress;
        invoice.invoiceDate = invoiceDate;
    
        invoice.items = items.map((item: any) => {
          const invoiceItem = new InvoiceItem();
          invoiceItem.itemName = item.itemName;
          invoiceItem.quantity = item.quantity;
          invoiceItem.rate = item.rate;
          invoiceItem.total = item.quantity * item.rate;
          return invoiceItem;
        });
        const invoiceCount = await this.invoiceRepository.count();
        const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(3, '0')}`;
        invoice.invoiceNumber = invoiceNumber;
    
    
        return await this.invoiceRepository.save(invoice);
      }
    
    
      async getInvoices(search?: string, sortBy?: string, order: 'ASC' | 'DESC' = 'ASC',  includeItems: boolean = false,
      ) {
        const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice');
    
        if (search) {
          queryBuilder.where('invoice.invoiceNumber LIKE :search', { search: `%${search}%` })
            .orWhere('invoice.fromName LIKE :search', { search: `%${search}%` })
            .orWhere('invoice.toName LIKE :search', { search: `%${search}%` })
            .orWhere('DATE(invoice.invoiceDate) = :search', { search });
        }
    
        if (sortBy) {
          queryBuilder.orderBy(`invoice.${sortBy}`, order);
        } else {
          queryBuilder.orderBy('invoice.invoiceDate', 'ASC');
        }
    
        const invoices = await this.invoiceRepository.find({
          relations: ["items"], 
        });
        
        return invoices.map((invoice) => {
          const totalAmount = invoice.items?.reduce(
            (sum, item) => sum + item.quantity * item.rate,
            0
          ) || 0;
          
          if (!includeItems) {
            const { items, ...rest } = invoice;
            return { ...rest, totalAmount };
          }
          return { ...invoice, totalAmount };
        });
  }
          
      async getInvoiceById(id: number): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({
          where: { id: id },
          relations: ["items"],
        });
      
        if (!invoice) {
          throw new Error(`Invoice with ID ${id} not found`);
        }
        return invoice;      
      }
    
      async deleteInvoice(id: number): Promise<void> {
        await this.invoiceRepository.delete(id);
      }
    
}
