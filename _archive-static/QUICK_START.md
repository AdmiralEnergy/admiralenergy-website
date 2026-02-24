# 🚀 Admiral Energy Optimization - Quick Start Guide

> **For starting or resuming optimization work across multiple sessions**

---

## ✨ Most Common Prompts

### 1. Continue Where We Left Off
```
"Continue Admiral Energy optimization"
```
**What happens**: AI reads PROGRESS_TRACKER.md, finds next task, and starts working.

---

### 2. Start Specific Task
```
"Start Task 1.1: Fix ARIA labels"
```
**What happens**: AI jumps to that specific task and begins work.

---

### 3. Show Current Progress
```
"Show Admiral Energy optimization progress"
```
**What happens**: AI reads tracker and shows what's done, what's next.

---

### 4. Review Before Proceeding
```
"Show me what Task 1.1 will change before starting"
```
**What happens**: AI explains changes without executing them yet.

---

### 5. Test Current State
```
"Test the Admiral Energy site locally with netlify dev"
```
**What happens**: AI starts local server for testing.

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `PROGRESS_TRACKER.md` | Your task list with status |
| `docs/OPTIMIZATION_PROMPT.md` | Detailed instructions for each fix |
| `README.md` | General project documentation |

---

## 🎯 Typical Session Flow

### Starting Fresh Session:
1. **Say**: "Continue Admiral Energy optimization"
2. **AI will**: Read tracker, start next task
3. **AI updates**: PROGRESS_TRACKER.md with status
4. **AI commits**: Changes with reference to task ID
5. **You review**: Check the changes
6. **Repeat**: Say "continue" for next task

### Mid-Session:
1. **Say**: "Continue to next task"
2. **AI moves**: To next item in tracker
3. **Automatic**: Status updates, commits

### Ending Session:
1. **Say**: "Commit current progress and summarize"
2. **AI will**: Commit all changes, update tracker
3. **AI summarizes**: What was done, what's next
4. **Next time**: Just say "continue Admiral Energy optimization"

---

## 🔧 Troubleshooting

### AI Seems Confused?
```
"Read PROGRESS_TRACKER.md and tell me the current status"
```

### Want to Skip a Task?
```
"Mark Task 1.X as skipped and move to Task 1.Y"
```

### Need to Go Back?
```
"Undo Task 1.X and mark it as NEXT UP"
```

### Want More Detail?
```
"Explain Task 1.X in detail before starting"
```

---

## 📊 Progress at a Glance

Check `PROGRESS_TRACKER.md` for:
- ✅ Tasks completed
- ⏳ Current task
- ⏭️ Next up
- 📈 Overall percentage

---

## 🎓 First Time Using This System?

### Prompt Template:
```
"I want to continue the Admiral Energy website optimization. 
Please read PROGRESS_TRACKER.md to see where we are, 
then start the next available task following the 
OPTIMIZATION_PROMPT.md guidelines."
```

**That's it!** The system handles the rest.

---

## 💡 Pro Tips

1. **Always test locally** before committing to production
2. **Review changes** before pushing to main branch  
3. **One task at a time** - Don't try to do everything at once
4. **Update tracker** - Keep it current for next session
5. **Read commit messages** - They reference task IDs

---

## ⚡ Speed Run (Experienced Users)

```bash
# Session start
"Continue Admiral Energy optimization"

# After each task completes
"Continue"

# When done for the day
"Commit and summarize progress"
```

---

**Last Updated**: October 30, 2025  
**System Version**: 1.0  
**Total Tasks**: 20 (across 3 phases)