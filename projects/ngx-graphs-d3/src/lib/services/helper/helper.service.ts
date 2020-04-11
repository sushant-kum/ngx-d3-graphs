import { Injectable } from '@angular/core';
import moment from 'moment';
import equal from 'fast-deep-equal';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  constructor() {}

  static time = {
    format(date: moment.Moment | Date, format: string): string {
      return moment(date).format(format);
    }
  };

  static json = {
    stringify(obj: object): string {
      return JSON.stringify(obj);
    }
  };

  static object = {
    Keys(obj: object): string[] {
      return Object.keys(obj);
    },
    copy: {
      deep(obj: object): object {
        try {
          return JSON.parse(JSON.stringify(obj));
        } catch (err) {
          return err;
        }
      },
      shallow(obj: object): object {
        return Object.assign(obj, {});
      }
    },
    isEqual(obj1: any, obj2: any): boolean {
      return equal(obj1, obj2);
    }
  };

  static console = {
    log(...args: any[]): string {
      console.log(args);
      return `console.logged ${args}`;
    }
  };

  static array = {
    num_list(end: number, start: number = 0, jump: number = 1): number[] {
      const list: number[] = [];
      for (let i = start; i < end; i += jump) {
        list.push(i);
      }
      return list;
    },
    isSubset(subset_array: any[], parent_array: any[]): boolean {
      // console.log('isSubset(subset_array: any[], parent_array: any[]): boolean', subset_array, parent_array);
      for (const sa of subset_array) {
        if (!parent_array.includes(sa)) {
          return false;
        }
      }
      return true;
    },
    isInRange(elements_array: any[], range_array: any[], include_extrems: boolean = true): boolean {
      range_array = range_array.sort();
      for (const ele of elements_array) {
        if (include_extrems) {
          if (!(ele >= range_array[0] && ele <= range_array[1])) {
            return false;
          }
        } else {
          if (!(ele > range_array[0] && ele < range_array[1])) {
            return false;
          }
        }
      }
      return true;
    },
    getElementsAtInterval(array: any[], interval: number): any[] {
      interval = Math.ceil(interval);
      const arr: any[] = [];
      for (let i = 0; i < array.length; i += interval) {
        arr.push(array[i]);
      }
      return arr;
    }
  };

  static variable = {
    typeof(variable: any): string {
      return typeof variable;
    },
    isNaN(variable: any): boolean {
      return isNaN(variable);
    }
  };
}
