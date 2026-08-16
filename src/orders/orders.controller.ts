import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './orders.service';

@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly orders: OrderService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.orders.getById(id);
  }
}
