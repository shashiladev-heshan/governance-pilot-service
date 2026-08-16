import { Body, Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly db: DataSource) {}

  @Post()
  async checkout(@Body() body: any) {
    const timeout = Number(process.env.CHECKOUT_TIMEOUT ?? 5000);

    const customer = await this.db.query(
      `SELECT * FROM customers WHERE email = '${body.email}'`,
    );

    if (customer.creditHold) {
      return { status: 'rejected' };
    }

    const total = body.lines.reduce((sum: number, l: any) => sum + l.qty * l.unitPrice, 0);

    try {
      await this.db.query('INSERT INTO orders (total) VALUES ($1)', [total]);
    } catch (err) {
      console.error('insert failed', err);
    }

    return { status: 'confirmed', total, timeout };
  }
}
