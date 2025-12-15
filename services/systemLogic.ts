
import { Lead, User, Interaction, MenuItemId, SystemLog } from '../types';

/**
 * SPIDER WEB LOGIC ENGINE
 * Handles the "1 Action -> 9 Reactions" Rule.
 */

// --- INITIAL MOCK STATE ---
export const initialUser: User = {
  id: 'u1',
  name: 'Alex Sales',
  role: 'staff',
  avatar: 'https://i.pravatar.cc/150?u=alex',
  score: 100,
  wallet: 500, // $
  pendingTraining: [],
  aiTasksCompleted: 0
};

// --- SCORING MATRIX ---
const SCORES = {
  LEAD_FOUND: 10,
  LEAD_WITH_PHONE_BONUS: 5,
  MARKETING_VIRAL: 5,
  CALL_SUCCESS: 50,
  RATING_5_STAR: 20,
  PROJECT_COMPLETE: 30,
  AI_TASK_COMPLETE: 2, // New score for running AI tasks
  // Penalties
  LEAD_NEGLECTED: -15,
  TRAINING_REQUIRED: -10,
  PROJECT_DELAY: -20,
  CALL_FAILURE: -5,
};

export class SpiderWebLogic {
  private updateState: (updater: (prev: any) => any) => void;

  constructor(updateStateFn: any) {
    this.updateState = updateStateFn;
  }

  // --- CORE TRIGGERS ---

  /**
   * TRIGGER 1: New Lead Found (Menu 2)
   */
  public handleNewLead(lead: Lead) {
    this.log(MenuItemId.LEAD_FINDER, `Found new lead: ${lead.name}`, 'positive');
    
    // 1. Assign to User (CRM)
    const assignedLead = { ...lead, assignedTo: initialUser.id, status: 'new' };
    
    // 2. Score Reward
    let pointsToAdd = SCORES.LEAD_FOUND;
    if (lead.phone) {
       pointsToAdd += SCORES.LEAD_WITH_PHONE_BONUS;
       this.log(MenuItemId.LEAD_FINDER, `Bonus: High Value Lead (Phone Found) +${SCORES.LEAD_WITH_PHONE_BONUS} pts`, 'positive');
    }
    this.modifyScore(pointsToAdd, `Found Lead: ${lead.name}`);

    // 3. Trigger Marketing (Simulated)
    this.log(MenuItemId.MARKETING, `Auto-sent Welcome Email to ${lead.email || 'N/A'}`, 'neutral');

    // 4. Update State
    this.updateState((prev: any) => ({
      ...prev,
      leads: [...prev.leads, assignedLead],
      user: { ...prev.user, score: prev.user.score + pointsToAdd }
    }));

    return assignedLead;
  }

  /**
   * TRIGGER 2: Interaction Logged (Menu 3)
   */
  public handleInteraction(interaction: Interaction) {
    this.log(MenuItemId.CRM, `Recorded ${interaction.type} with ${interaction.leadId}: ${interaction.outcome}`, 
      interaction.outcome === 'success' ? 'positive' : interaction.outcome === 'failure' ? 'negative' : 'neutral'
    );

    if (interaction.outcome === 'success') {
      // SUCCESS FLOW
      this.modifyScore(SCORES.CALL_SUCCESS, "Successful Interaction Reward");
      this.modifyWallet(50, "Commission for Sale/Success"); 
      
      this.updateState((prev: any) => ({
        ...prev,
        interactions: [interaction, ...prev.interactions],
        leads: prev.leads.map((l: Lead) => l.id === interaction.leadId ? { ...l, status: 'converted' } : l),
        user: { 
          ...prev.user, 
          score: prev.user.score + SCORES.CALL_SUCCESS,
          wallet: prev.user.wallet + 50 
        }
      }));

    } else if (interaction.outcome === 'failure') {
      // FAILURE FLOW -> TRIGGER COACHING PENALTY
      this.modifyScore(SCORES.CALL_FAILURE, "Failed Interaction Penalty");
      
      const trainingModule = interaction.type === 'call' ? "Advanced Telesales Skills" : "Writing Better Emails";
      this.log(MenuItemId.COACHING, `Performance Flagged! Assigned Training: ${trainingModule}`, 'negative');

      this.updateState((prev: any) => ({
        ...prev,
        interactions: [interaction, ...prev.interactions],
        user: { 
          ...prev.user, 
          score: prev.user.score + SCORES.CALL_FAILURE,
          pendingTraining: prev.user.pendingTraining.includes(trainingModule) ? prev.user.pendingTraining : [...prev.user.pendingTraining, trainingModule]
        }
      }));
    } else {
        // NEUTRAL
        this.updateState((prev: any) => ({
            ...prev,
            interactions: [interaction, ...prev.interactions],
        }));
    }
  }

  public handleSMS(lead: Lead) {
      this.log(MenuItemId.CRM, `Manual SMS Init for ${lead.name}`, 'neutral');
      // Logic handled via modal mostly
  }

  /**
   * TRIGGER 3: Complete Training (Menu 5)
   */
  public completeTraining(moduleName: string) {
    this.log(MenuItemId.COACHING, `Completed Training: ${moduleName}`, 'positive');
    this.modifyScore(15, "Training Completion Bonus");

    this.updateState((prev: any) => ({
      ...prev,
      user: {
        ...prev.user,
        score: prev.user.score + 15,
        pendingTraining: prev.user.pendingTraining.filter((t: string) => t !== moduleName)
      }
    }));
  }

  /**
   * TRIGGER 4: AI Task Execution (Any Menu)
   * Records the AI action and gives a small efficiency bonus.
   */
  public logAIAction(module: MenuItemId, actionLabel: string) {
    this.log(module, `AI Task Completed: ${actionLabel}`, 'positive');
    
    // Give a small bonus for using AI tools (Efficiency Bonus)
    this.updateState((prev: any) => ({
      ...prev,
      user: { 
        ...prev.user, 
        score: prev.user.score + SCORES.AI_TASK_COMPLETE,
        aiTasksCompleted: (prev.user.aiTasksCompleted || 0) + 1
      }
    }));
  }

  // --- HELPERS ---

  private modifyScore(amount: number, reason: string) {
    // Logic is handled in the state updaters above
  }

  private modifyWallet(amount: number, reason: string) {
    // Logic is handled in the state updaters above
  }

  private log(module: MenuItemId, action: string, impact: 'positive' | 'negative' | 'neutral') {
    const newLog: SystemLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      module,
      action,
      details: '',
      impact
    };
    
    // Update logs in state
    this.updateState((prev: any) => ({
      ...prev,
      logs: [newLog, ...prev.logs].slice(0, 50)
    }));
  }
}