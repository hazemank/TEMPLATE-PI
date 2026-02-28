import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, PlatformClass } from '../../services/data.service';
import { LucideAngularModule, Video, Plus, Search, Filter, Pencil, Trash2, X, Clock, Globe, Calendar, User, ExternalLink, AlertTriangle } from 'lucide-angular';

const EMPTY_CLASS = (): Omit<PlatformClass, 'id'> => ({
    title: '', instructor: '', day: 'Monday',
    time: '', duration: '', level: '', type: 'Live Class', link: ''
});

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TYPES = ['Live Class', 'Workshop', 'Masterclass', 'Bootcamp', 'Webinar'];
const LEVELS = ['A1', 'A2', 'A2/B1', 'B1', 'B2', 'C1', 'C2', 'All Levels', 'Beginner', 'Intermediate', 'Advanced'];

@Component({
    selector: 'app-admin-classes',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">Class <span class="text-teal-600 underline decoration-2 underline-offset-4">Scheduler</span></h1>
          <p class="text-muted-foreground mt-1">Manage your weekly live sessions, instructors, and Zoom links.</p>
        </div>
        <button (click)="openCreate()" class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          Schedule Class
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
            <lucide-icon [name]="Video" [size]="22"></lucide-icon>
          </div>
          <div>
            <p class="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Classes</p>
            <p class="text-2xl font-black">{{ data.classes().length }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <lucide-icon [name]="User" [size]="22"></lucide-icon>
          </div>
          <div>
            <p class="text-xs font-black text-muted-foreground uppercase tracking-widest">Instructors</p>
            <p class="text-2xl font-black">{{ instructorCount() }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
            <lucide-icon [name]="Calendar" [size]="22"></lucide-icon>
          </div>
          <div>
            <p class="text-xs font-black text-muted-foreground uppercase tracking-widest">Days Active</p>
            <p class="text-2xl font-black">{{ daysActive() }}</p>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div class="p-6 border-b border-border flex items-center gap-4">
          <div class="relative flex-1 max-w-md">
            <lucide-icon [name]="Search" [size]="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
            <input [(ngModel)]="searchQuery" type="text" placeholder="Search classes or instructors..."
                   class="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/50 border-none focus:ring-2 focus:ring-teal-600/20 font-medium outline-none">
          </div>
          <select [(ngModel)]="filterDay"
                  class="px-4 py-3 rounded-2xl bg-muted/50 border-none font-bold text-sm outline-none focus:ring-2 focus:ring-teal-600/20">
            <option value="">All Days</option>
            @for (d of days; track d) { <option [value]="d">{{ d }}</option> }
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-muted/30">
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Class</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Instructor</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Schedule</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Link</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              @for (cls of filtered(); track cls.id) {
                <tr class="hover:bg-muted/20 transition-colors group">
                  <td class="px-6 py-4">
                    <div class="space-y-1">
                      <span class="text-[9px] font-black uppercase tracking-widest text-teal-600 bg-teal-100/50 px-2 py-0.5 rounded italic">{{ cls.type }}</span>
                      <p class="font-bold text-foreground group-hover:text-teal-600 transition-colors whitespace-nowrap">{{ cls.title }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-[10px] shadow shadow-teal-600/20">{{ cls.instructor.charAt(0) }}</div>
                      <span class="text-sm font-bold whitespace-nowrap">{{ cls.instructor }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="space-y-1">
                      <div class="flex items-center gap-1.5 text-xs font-bold capitalize">
                        <lucide-icon [name]="Calendar" [size]="12" class="text-teal-600"></lucide-icon>
                        {{ cls.day }}
                      </div>
                      <div class="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <lucide-icon [name]="Clock" [size]="12"></lucide-icon>
                        {{ cls.time }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">{{ cls.level }}</span>
                  </td>
                  <td class="px-6 py-4">
                    @if (cls.link) {
                      <a [href]="cls.link" target="_blank" class="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-bold text-xs group/link">
                        Open
                        <lucide-icon [name]="ExternalLink" [size]="12" class="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"></lucide-icon>
                      </a>
                    } @else {
                      <span class="text-muted-foreground text-xs">—</span>
                    }
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="openEdit(cls)" title="Edit" class="p-2 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-all">
                        <lucide-icon [name]="Pencil" [size]="16"></lucide-icon>
                      </button>
                      <button (click)="confirmDelete(cls)" title="Delete" class="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                        <lucide-icon [name]="Trash2" [size]="16"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="6" class="px-6 py-16 text-center text-muted-foreground font-medium">No classes match your filter.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── Create / Edit Modal ──────────────────────────────────────────── -->
    @if (showModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="closeModal()"></div>

        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-border overflow-hidden">
          <div class="flex items-center justify-between px-8 pt-8 pb-4 border-b border-border">
            <h2 class="text-xl font-bold">{{ isEditing() ? 'Edit Class' : 'Schedule New Class' }}</h2>
            <button (click)="closeModal()" class="p-2 rounded-xl hover:bg-muted transition-all">
              <lucide-icon [name]="X" [size]="20"></lucide-icon>
            </button>
          </div>

          <form (ngSubmit)="save()" class="p-8 space-y-5 max-h-[70vh] overflow-y-auto">

            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Class Title *</label>
              <input [(ngModel)]="form.title" name="title" required placeholder="e.g. Advanced Business English"
                     class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Instructor *</label>
              <input [(ngModel)]="form.instructor" name="instructor" required placeholder="e.g. Dr. Sarah Wilson"
                     class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Day *</label>
                <select [(ngModel)]="form.day" name="day"
                        class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                  @for (d of days; track d) { <option [value]="d">{{ d }}</option> }
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Type *</label>
                <select [(ngModel)]="form.type" name="type"
                        class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                  @for (t of types; track t) { <option [value]="t">{{ t }}</option> }
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Time *</label>
                <input [(ngModel)]="form.time" name="time" required placeholder="e.g. 10:00 AM - 12:00 PM"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Duration *</label>
                <input [(ngModel)]="form.duration" name="duration" required placeholder="e.g. 2 hours"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Level *</label>
                <select [(ngModel)]="form.level" name="level"
                        class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                  <option value="">Select level...</option>
                  @for (l of levels; track l) { <option [value]="l">{{ l }}</option> }
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Zoom / Session Link</label>
                <input [(ngModel)]="form.link" name="link" placeholder="https://zoom.us/j/..."
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
              </div>
            </div>

            <div class="flex items-center gap-3 pt-4 border-t border-border">
              <button type="submit" [disabled]="!form.title || !form.instructor || !form.time"
                      class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                {{ isEditing() ? 'Save Changes' : 'Add to Schedule' }}
              </button>
              <button type="button" (click)="closeModal()" class="px-6 py-3 rounded-2xl border border-border font-bold hover:bg-muted transition-all">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- ── Delete Confirm ──────────────────────────────────────────── -->
    @if (deleteTarget()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="deleteTarget.set(null)"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 border border-border text-center">
          <div class="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mx-auto text-red-500">
            <lucide-icon [name]="AlertTriangle" [size]="28"></lucide-icon>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-2">Remove Class?</h3>
            <p class="text-muted-foreground text-sm">
              "<strong>{{ deleteTarget()!.title }}</strong>" will be permanently removed from the schedule.
            </p>
          </div>
          <div class="flex gap-3">
            <button (click)="doDelete()" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all active:scale-95">Remove</button>
            <button (click)="deleteTarget.set(null)" class="flex-1 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all">Cancel</button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminClassesComponent {
    data = inject(DataService);

    readonly days = DAYS;
    readonly types = TYPES;
    readonly levels = LEVELS;

    // Icons
    readonly Video = Video; readonly Plus = Plus; readonly Search = Search;
    readonly Filter = Filter; readonly Pencil = Pencil; readonly Trash2 = Trash2;
    readonly X = X; readonly Clock = Clock; readonly Globe = Globe;
    readonly Calendar = Calendar; readonly User = User; readonly ExternalLink = ExternalLink;
    readonly AlertTriangle = AlertTriangle;

    searchQuery = '';
    filterDay = '';
    showModal = signal(false);
    isEditing = signal(false);
    editId = signal<number | string | null>(null);
    deleteTarget = signal<PlatformClass | null>(null);

    form: Omit<PlatformClass, 'id'> = EMPTY_CLASS();

    filtered() {
        return this.data.classes().filter(c => {
            const q = this.searchQuery.toLowerCase();
            const matchQ = !q || c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q);
            const matchDay = !this.filterDay || c.day === this.filterDay;
            return matchQ && matchDay;
        });
    }

    instructorCount() {
        return new Set(this.data.classes().map(c => c.instructor)).size;
    }

    daysActive() {
        return new Set(this.data.classes().map(c => c.day)).size;
    }

    openCreate() {
        this.form = EMPTY_CLASS();
        this.isEditing.set(false);
        this.editId.set(null);
        this.showModal.set(true);
    }

    openEdit(cls: PlatformClass) {
        const { id, ...rest } = cls;
        this.form = { ...rest };
        this.editId.set(id);
        this.isEditing.set(true);
        this.showModal.set(true);
    }

    closeModal() { this.showModal.set(false); }

    save() {
        if (!this.form.title || !this.form.instructor || !this.form.time) return;
        if (this.isEditing() && this.editId() !== null) {
            this.data.updateClass({ id: this.editId()!, ...this.form });
        } else {
            this.data.addClass({ id: Date.now(), ...this.form });
        }
        this.closeModal();
    }

    confirmDelete(cls: PlatformClass) { this.deleteTarget.set(cls); }

    doDelete() {
        if (this.deleteTarget()) {
            this.data.deleteClass(this.deleteTarget()!.id);
            this.deleteTarget.set(null);
        }
    }
}
