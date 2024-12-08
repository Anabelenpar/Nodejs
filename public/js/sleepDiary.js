export const sleepDiary = {
    sleepEntries: [],
    token: null,

    async init(token) {
        this.token = token;
        await this.loadEntries();
    },

    async loadEntries() {
        try {
            const response = await fetch('/api/data', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                this.sleepEntries = data.sleepEntries || [];
            } else {
                console.error('Failed to load sleep entries');
            }
        } catch (error) {
            console.error('Error loading sleep entries:', error);
        }
    },

    async addEntry(entry) {
        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(entry)
            });
            if (response.ok) {
                this.sleepEntries.push(entry);
            } else {
                console.error('Failed to add sleep entry');
            }
        } catch (error) {
            console.error('Error adding sleep entry:', error);
        }
    },

    calculateStatistics() {
        if (this.sleepEntries.length === 0) return null;

        const totalDuration = this.sleepEntries.reduce((sum, entry) => sum + entry.duration, 0);
        const totalQuality = this.sleepEntries.reduce((sum, entry) => sum + entry.quality, 0);
        const avgDuration = totalDuration / this.sleepEntries.length;
        const avgQuality = totalQuality / this.sleepEntries.length;

        const lastWeekEntries = this.sleepEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return entryDate >= weekAgo;
        });

        const weeklyAvgDuration = lastWeekEntries.reduce((sum, entry) => sum + entry.duration, 0) / lastWeekEntries.length || 0;

        return {
            avgDuration: avgDuration.toFixed(2),
            avgQuality: avgQuality.toFixed(2),
            totalEntries: this.sleepEntries.length,
            weeklyAvgDuration: weeklyAvgDuration.toFixed(2)
        };
    },

    generatePersonalizedTips(entry) {
        let tips = [];
        const stats = this.calculateStatistics();

        if (entry.duration < 6) {
            tips.push('Parece que dormiste poco. Intenta acostarte más temprano esta noche.');
        } else if (entry.duration > 9) {
            tips.push('Dormiste más de lo recomendado. Considera ajustar tu horario de sueño.');
        }

        if (entry.quality < 3) {
            tips.push('Tu calidad de sueño puede mejorar. Prueba técnicas de relajación antes de dormir.');
        } else if (entry.quality >= 4) {
            tips.push('¡Buen trabajo! Mantén tus hábitos de sueño actuales.');
        }

        if (stats) {
            if (entry.duration < stats.avgDuration) {
                tips.push(`Dormiste menos que tu promedio de ${stats.avgDuration} horas. Intenta mantener un horario más consistente.`);
            }
            if (entry.quality < stats.avgQuality) {
                tips.push(`La calidad de tu sueño fue menor que tu promedio de ${stats.avgQuality}. Considera factores que puedan estar afectando tu descanso.`);
            }
        }

        return tips;
    }
};
