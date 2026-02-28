import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule, Trophy, Calendar, MapPin, CheckSquare, Play, ArrowRight } from 'lucide-angular';
import { DataService, Competition } from '../services/data.service';

@Component({
    selector: 'app-competition-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    template: `
    @if (comp()) {
      <div class="min-h-screen bg-background pb-20 pt-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <!-- Back Link -->
          <a routerLink="/competitions" class="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-teal-600 transition-colors mb-8 group">
            <lucide-icon [name]="ArrowRight" [size]="16" class="rotate-180 group-hover:-translate-x-1 transition-transform"></lucide-icon>
            Back to Competitions
          </a>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Left Side: Content -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Banner Image -->
              <div class="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-teal-600/5 group border border-border">
                <img [src]="comp()!.image" [alt]="comp()!.title" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div class="space-y-6">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-teal-600 text-white">{{ comp()!.status }}</span>
                  <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest">{{ comp()!.category }}</span>
                </div>
                
                <h1 class="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                  {{ comp()!.title }}
                </h1>
                
                <p class="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-teal-600 pl-6 py-2">
                  "{{ comp()!.description }}"
                </p>

                <div class="prose prose-teal max-w-none text-muted-foreground leading-relaxed">
                  <h2 class="text-2xl font-bold text-foreground">Challenge Overview</h2>
                  <p>
                    Join the most prestigious English contest of the year. This competition is more than just a test; it's a platform for your growth, a chance to network with experts, and a path to global recognition.
                  </p>
                  <p>
                    Whether you are a student, a professional, or an enthusiast, this challenge offers tailored tracks to ensure fair and exciting competition for everyone.
                  </p>
                </div>
              </div>
            </div>

            <!-- Right Side: Sidebar Info -->
            <div class="space-y-8">
              <div class="bg-white rounded-3xl border border-border p-8 shadow-sm space-y-8 sticky top-32">
                <div class="space-y-6">
                  <h3 class="text-xl font-bold text-foreground">Competition Details</h3>
                  
                  <div class="space-y-4">
                    <div class="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
                      <div class="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shadow-inner">
                        <lucide-icon [name]="Trophy" [size]="20"></lucide-icon>
                      </div>
                      <div>
                        <span class="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Grand Prize</span>
                        <span class="font-bold text-foreground">{{ comp()!.prize }}</span>
                      </div>
                    </div>

                    <div class="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
                      <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
                        <lucide-icon [name]="Calendar" [size]="20"></lucide-icon>
                      </div>
                      <div>
                        <span class="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Deadline</span>
                        <span class="font-bold text-foreground">{{ comp()!.deadline }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-4 pt-8 border-t border-border">
                  <button class="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                    Register Now
                  </button>
                  <p class="text-center text-xs text-muted-foreground font-medium italic">
                    By registering, you agree to the competition terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-screen flex items-center justify-center">
        <div class="animate-pulse text-teal-600 font-bold">Loading competition details...</div>
      </div>
    }
  `
})
export class CompetitionDetailComponent implements OnInit {
    private dataService = inject(DataService);
    private route = inject(ActivatedRoute);

    readonly Trophy = Trophy;
    readonly Calendar = Calendar;
    readonly MapPin = MapPin;
    readonly CheckSquare = CheckSquare;
    readonly Play = Play;
    readonly ArrowRight = ArrowRight;

    comp = signal<Competition | null>(null);

    ngOnInit() {
        this.route.params.subscribe(params => {
            const slug = params['slug'];
            const found = this.dataService.competitions().find(c => c.slug === slug);
            this.comp.set(found || this.dataService.competitions()[0]);
        });
    }
}
