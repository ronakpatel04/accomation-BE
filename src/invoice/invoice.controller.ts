import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {

    constructor(private readonly invoiceService: InvoiceService) {}

    @Post()
    async createInvoice(@Body() data: any) {
      return this.invoiceService.createInvoice(data);
    }
  
  
    @Get()
    async getInvoices(
      @Query('search') search?: string, 
      @Query('sortBy') sortBy?: string, 
      @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    ) {
      return this.invoiceService.getInvoices(search, sortBy, order);
    }  
    @Get(':id')
    async getInvoiceById(@Param('id') id: number) {
      return this.invoiceService.getInvoiceById(id);
    }
  
    @Delete(':id')
    async deleteInvoice(@Param('id') id: number) {
      return this.invoiceService.deleteInvoice(id);
    }
  
}
