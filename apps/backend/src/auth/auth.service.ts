import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createGuestSession() {
    const uniqueSuffix = randomUUID().slice(0, 8);

    const user = await this.prisma.user.create({
      data: {
        email: `guest-${uniqueSuffix}@pyramid.local`,
        fullName: 'Guest',
        username: `guest_${uniqueSuffix}`,
        isGuest: true,
        workspaces: {
          create: {
            role: 'owner',
            workspace: {
              create: { name: 'My Workspace' },
            },
          },
        },
      },
      include: {
        workspaces: { include: { workspace: true } },
      },
    });

    const token = await this.signToken(user.id);
    const workspace = user.workspaces[0].workspace;

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        isGuest: user.isGuest,
        themeMode: user.themeMode,
        colorMode: user.colorMode,
      },
      workspace: { id: workspace.id, name: workspace.name },
    };
  }

  private signToken(userId: string) {
    return this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: '30d' },
    );
  }
}