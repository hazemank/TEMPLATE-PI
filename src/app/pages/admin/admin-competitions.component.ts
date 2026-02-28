import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Competition } from '../../services/data.service';
import { LucideAngularModule, Trophy, Plus, Calendar, Search, Filter, Pencil, Trash2, X, CheckCircle2, Clock, AlertTriangle } from 'lucide-angular';

const EMPTY_COMP = (): Omit<Competition, 'id'> => ({
    title: '', description: '', image: '/images/event-1.jpg',
    slug: '', status: 'upcoming', deadline: '', prize: '', category: ''
});

@Component({
    selector: 'app-admin-competitions',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">Competition <span class="text-teal-600 underline decoration-2 underline-offset-4">Manager</span></h1>
          <p class="text-muted-foreground mt-1">Create, edit, and delete competitions.</p>
        </div>
        <button (click)="openCreate()" class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          New Competition
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
            <lucide-icon [name]="Trophy" [size]="22"></lucide-icon>
          </div>
          <div>
            <p class="text-xs font-black text-muted-foreground uppercase tracking-widest">Total</p>
            <p class="text-2xl font-black">{{ data.competitions().length }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
            <lucide-icon [name]="CheckCircle2" [size]="22"></lucide-icon>
          </div>
          <div>
            <p class="text-xs font-black text-muted-foreground uppercase tracking-widest">Ongoing</p>
            <p class="text-2xl font-black">{{ countByStatus('ongoing') }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
            <lucide-icon [name]="Clock" [size]="22"></lucide-icon>
          </div>
          <div>
            <p class="text-xs font-black text-muted-foreground uppercase tracking-widest">Upcoming</p>
            <p class="text-2xl font-black">{{ countByStatus('upcoming') }}</p>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div class="p-6 border-b border-border flex items-center gap-4">
          <div class="relative flex-1 max-w-md">
            <lucide-icon [name]="Search" [size]="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
            <input [(ngModel)]="searchQuery" type="text" placeholder="Search competitions..."
                   class="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/50 border-none focus:ring-2 focus:ring-teal-600/20 font-medium outline-none">
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-muted/30">
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Competition</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prize</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deadline</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              @for (comp of filtered(); track comp.id) {
                <tr class="hover:bg-muted/20 transition-colors group">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-xl border border-border overflow-hidden shrink-0 bg-muted">
                        <img [src]="comp.image" [alt]="comp.title" class="w-full h-full object-cover">
                      </div>
                      <span class="font-bold text-foreground group-hover:text-teal-600 transition-colors line-clamp-1 max-w-[200px]">{{ comp.title }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">{{ comp.category }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-teal-600 whitespace-nowrap">{{ comp.prize }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground whitespace-nowrap">
                      <lucide-icon [name]="Calendar" [size]="14"></lucide-icon>
                      {{ comp.deadline }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span [ngClass]="{
                      'bg-teal-600/10 text-teal-600': comp.status === 'ongoing',
                      'bg-orange-500/10 text-orange-600': comp.status === 'upcoming',
                      'bg-muted text-muted-foreground': comp.status === 'completed'
                    }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{{ comp.status }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="openEdit(comp)" class="p-2 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-all" title="Edit">
                        <lucide-icon [name]="Pencil" [size]="16"></lucide-icon>
                      </button>
                      <button (click)="confirmDelete(comp)" class="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all" title="Delete">
                        <lucide-icon [name]="Trash2" [size]="16"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="6" class="px-6 py-16 text-center text-muted-foreground font-medium">No competitions found.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── Create / Edit Modal ──────────────────────────────────────────── -->
    @if (showModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="closeModal()"></div>

        <!-- Sheet -->
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-border">
          <div class="flex items-center justify-between px-8 pt-8 pb-4 border-b border-border">
            <h2 class="text-xl font-bold">{{ isEditing() ? 'Edit Competition' : 'New Competition' }}</h2>
            <button (click)="closeModal()" class="p-2 rounded-xl hover:bg-muted transition-all">
              <lucide-icon [name]="X" [size]="20"></lucide-icon>
            </button>
          </div>

          <form (ngSubmit)="save()" class="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
            <div class="grid grid-cols-1 gap-5">

              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Title *</label>
                <input [(ngModel)]="form.title" name="title" required placeholder="e.g. Global Speech Contest 2025"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Description *</label>
                <textarea [(ngModel)]="form.description" name="description" required rows="3" placeholder="Short description of the competition…"
                          class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all resize-none"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Category *</label>
                  <input [(ngModel)]="form.category" name="category" required placeholder="e.g. Speaking"
                         class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Status *</label>
                  <select [(ngModel)]="form.status" name="status"
                          class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Prize *</label>
                  <input [(ngModel)]="form.prize" name="prize" required placeholder="e.g. $5,000 + Scholarship"
                         class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Deadline *</label>
                  <input [(ngModel)]="form.deadline" name="deadline" required placeholder="e.g. Oct 15, 2025"
                         class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Image URL</label>
                <input [(ngModel)]="form.image" name="image" placeholder="/images/event-1.jpg"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
              </div>

            </div>

            <div class="flex items-center gap-3 pt-4 border-t border-border">
              <button type="submit" [disabled]="!form.title || !form.prize || !form.deadline"
                      class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                {{ isEditing() ? 'Save Changes' : 'Create Competition' }}
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
            <h3 class="text-xl font-bold mb-2">Delete Competition?</h3>
            <p class="text-muted-foreground text-sm">
              "<strong>{{ deleteTarget()!.title }}</strong>" will be permanently removed. This action cannot be undone.
            </p>
          </div>
          <div class="flex gap-3">
            <button (click)="doDelete()" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all active:scale-95">Delete</button>
            <button (click)="deleteTarget.set(null)" class="flex-1 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all">Cancel</button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminCompetitionsComponent {
    data = inject(DataService);

    // Icons
    readonly Trophy = Trophy; readonly Plus = Plus; readonly Calendar = Calendar;
    readonly Search = Search; readonly Filter = Filter; readonly Pencil = Pencil;
    readonly Trash2 = Trash2; readonly X = X; readonly CheckCircle2 = CheckCircle2;
    readonly Clock = Clock; readonly AlertTriangle = AlertTriangle;

    searchQuery = '';
    showModal = signal(false);
    isEditing = signal(false);
    editId = signal<number | string | null>(null);
    deleteTarget = signal<Competition | null>(null);

    form: Omit<Competition, 'id'> = EMPTY_COMP();

    filtered() {
        const q = this.searchQuery.toLowerCase();
        return q
            ? this.data.competitions().filter(c =>
                c.title.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q))
            : this.data.competitions();
    }

    countByStatus(s: Competition['status']) {
        return this.data.competitions().filter(c => c.status === s).length;
    }

    openCreate() {
        this.form = EMPTY_COMP();
        this.isEditing.set(false);
        this.editId.set(null);
        this.showModal.set(true);
    }

    openEdit(comp: Competition) {
        const { id, ...rest } = comp;
        this.form = { ...rest };
        this.editId.set(id);
        this.isEditing.set(true);
        this.showModal.set(true);
    }

    closeModal() { this.showModal.set(false); }

    save() {
        if (!this.form.title || !this.form.prize || !this.form.deadline) return;
        // auto-generate slug from title
        if (!this.form.slug) {
            this.form.slug = this.form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (this.isEditing() && this.editId() !== null) {
            this.data.updateCompetition({ id: this.editId()!, ...this.form });
        } else {
            this.data.addCompetition({ id: Date.now(), ...this.form });
        }
        this.closeModal();
    }

    confirmDelete(comp: Competition) { this.deleteTarget.set(comp); }

    doDelete() {
        if (this.deleteTarget()) {
            this.data.deleteCompetition(this.deleteTarget()!.id);
            this.deleteTarget.set(null);
        }
    }
}
