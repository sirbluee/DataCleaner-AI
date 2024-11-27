export interface CleaningStats {
  rowsRemoved: number;
  valuesImputed: number;
  outliersRemoved: number;
}

export class DataCleaner {
  static imputeByMean(data: any[], column: string): { newData: any[], stats: CleaningStats } {
    const values = data
      .map(row => row[column])
      .filter(val => val !== null && val !== undefined && val !== '' && !isNaN(Number(val)));
    
    if (values.length === 0) return { newData: data, stats: { rowsRemoved: 0, valuesImputed: 0, outliersRemoved: 0 } };
    
    const mean = values.reduce((sum, val) => sum + Number(val), 0) / values.length;
    let imputedCount = 0;
    
    const newData = data.map(row => {
      const value = row[column];
      if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
        imputedCount++;
        return { ...row, [column]: mean };
      }
      return row;
    });

    return {
      newData,
      stats: {
        rowsRemoved: 0,
        valuesImputed: imputedCount,
        outliersRemoved: 0
      }
    };
  }

  static imputeByMode(data: any[], column: string): { newData: any[], stats: CleaningStats } {
    const frequency: { [key: string]: number } = {};
    let missingCount = 0;

    data.forEach(row => {
      const value = row[column];
      if (value === null || value === undefined || value === '') {
        missingCount++;
      } else {
        frequency[value] = (frequency[value] || 0) + 1;
      }
    });

    if (Object.keys(frequency).length === 0) {
      return { newData: data, stats: { rowsRemoved: 0, valuesImputed: 0, outliersRemoved: 0 } };
    }

    const mode = Object.entries(frequency)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const newData = data.map(row => {
      const value = row[column];
      if (value === null || value === undefined || value === '') {
        return { ...row, [column]: mode };
      }
      return row;
    });

    return {
      newData,
      stats: {
        rowsRemoved: 0,
        valuesImputed: missingCount,
        outliersRemoved: 0
      }
    };
  }

  static deleteMissingRows(data: any[], column: string): { newData: any[], stats: CleaningStats } {
    const newData = data.filter(row => {
      const value = row[column];
      return value !== null && value !== undefined && value !== '';
    });

    return {
      newData,
      stats: {
        rowsRemoved: data.length - newData.length,
        valuesImputed: 0,
        outliersRemoved: 0
      }
    };
  }

  static removeOutliers(data: any[], column: string): { newData: any[], stats: CleaningStats } {
    const values = data
      .map(row => Number(row[column]))
      .filter(val => !isNaN(val));

    if (values.length < 4) {
      return { newData: data, stats: { rowsRemoved: 0, valuesImputed: 0, outliersRemoved: 0 } };
    }

    const sorted = values.sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const newData = data.filter(row => {
      const value = Number(row[column]);
      return isNaN(value) || (value >= lowerBound && value <= upperBound);
    });

    return {
      newData,
      stats: {
        rowsRemoved: 0,
        valuesImputed: 0,
        outliersRemoved: data.length - newData.length
      }
    };
  }

  static cleanDataset(data: any[], method: string): { newData: any[], stats: CleaningStats } {
    let newData = [...data];
    const stats = {
      rowsRemoved: 0,
      valuesImputed: 0,
      outliersRemoved: 0
    };

    const columns = Object.keys(data[0] || {});

    switch (method) {
      case 'impute_by_mean':
        columns.forEach(column => {
          const result = this.imputeByMean(newData, column);
          newData = result.newData;
          stats.valuesImputed += result.stats.valuesImputed;
        });
        break;

      case 'impute_by_mode':
        columns.forEach(column => {
          const result = this.imputeByMode(newData, column);
          newData = result.newData;
          stats.valuesImputed += result.stats.valuesImputed;
        });
        break;

      case 'delete_missing_rows':
        newData = data.filter(row => 
          Object.values(row).every(value => 
            value !== null && value !== undefined && value !== ''
          )
        );
        stats.rowsRemoved = data.length - newData.length;
        break;

      case 'delete_duplicates':
        const uniqueRows = new Map();
        newData.forEach(row => {
          const key = JSON.stringify(row);
          if (!uniqueRows.has(key)) {
            uniqueRows.set(key, row);
          }
        });
        newData = Array.from(uniqueRows.values());
        stats.rowsRemoved = data.length - newData.length;
        break;

      case 'remove_outliers':
        columns.forEach(column => {
          const result = this.removeOutliers(newData, column);
          newData = result.newData;
          stats.outliersRemoved += result.stats.outliersRemoved;
        });
        break;
    }

    return { newData, stats };
  }
}