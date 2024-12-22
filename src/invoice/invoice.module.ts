import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice } from './invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceItem } from './invoice-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice,InvoiceItem])],
  providers: [InvoiceService],
  controllers: [InvoiceController]
})
export class InvoiceModule {}
