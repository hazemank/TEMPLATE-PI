import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Clock, User, Globe, Video, Calendar } from 'lucide-angular';
import { DataService } from '../services/data.service';

@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="min-h-screen bg-background pb-20 pt-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 class="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            Weekly <span class="text-teal-600 underline underline-offset-8 decoration-4 italic">Live</span> Schedule
          </h1>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join our interactive live sessions led by world-class instructors. Practice, ask questions, and grow in real-time.
          </p>
        </div>

        <!-- Schedule Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (cls of data.classes(); track cls.id) {
            <div class="group relative bg-white rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-teal-600/10 transition-all duration-500 hover:-translate-y-1 p-8">
              <!-- Day & Time -->
              <div class="flex items-center justify-between mb-8">
                <div class="px-4 py-2 rounded-2xl bg-teal-50 text-teal-600 text-sm font-black uppercase tracking-widest shadow-inner">
                  {{ cls.day }}
                </div>
                <div class="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-teal-600 transition-colors">
                  <lucide-icon [name]="Clock" [size]="14"></lucide-icon>
                  {{ cls.time }}
                </div>
              </div>

              <!-- Title & Instructor -->
              <div class="space-y-4 mb-8">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-100/50 px-2 py-0.5 rounded italic">{{ cls.type }}</span>
                </div>
                <h3 class="text-2xl font-extrabold text-foreground group-hover:text-teal-600 transition-colors leading-tight">
                  {{ cls.title }}
                </h3>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-teal-600/20">
                    {{ cls.instructor.charAt(0) }}
                  </div>
                  <span class="text-sm font-bold text-foreground">with {{ cls.instructor }}</span>
                </div>
              </div>

              <!-- Meta -->
              <div class="grid grid-cols-2 gap-4 pt-6 border-t border-border mb-8">
                <div class="space-y-1">
                  <span class="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Level</span>
                  <div class="flex items-center gap-1.5 text-foreground font-bold text-xs uppercase tracking-wider">
                    <lucide-icon [name]="Globe" [size]="14" class="text-teal-600"></lucide-icon>
                    {{ cls.level }}
                  </div>
                </div>
                <div class="space-y-1 text-right">
                  <span class="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Duration</span>
                  <div class="flex items-center justify-end gap-1.5 text-foreground font-bold text-xs uppercase tracking-wider">
                    <lucide-icon [name]="Calendar" [size]="14" class="text-orange-500"></lucide-icon>
                    {{ cls.duration }}
                  </div>
                </div>
              </div>

              <!-- Action -->
              <button class="w-full py-4 bg-white border-2 border-teal-600 text-teal-600 group-hover:bg-teal-600 group-hover:text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg group-hover:shadow-teal-600/20 active:scale-95 overflow-hidden relative">
                <span class="relative z-10 flex items-center gap-2">
                  <lucide-icon [name]="Video" [size]="18"></lucide-icon>
                  Join Class
                </span>
                <div class="absolute inset-0 bg-teal-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          }
        </div>
        
        @if (data.classes().length === 0) {
          <div class="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-border animate-pulse">
            <p class="text-muted-foreground font-bold text-lg">No classes scheduled for today. Refresh soon!</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ClassesComponent {
    data = inject(DataService);

    readonly Clock = Clock;
    readonly User = User;
    readonly Globe = Globe;
    readonly Video = Video;
    readonly Calendar = Calendar;
}
