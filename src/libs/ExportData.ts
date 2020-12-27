interface IDesiredStartDate {
  originalDate?: Date;
  value: string;
}

export class DesiredStartDate implements IDesiredStartDate {
  originalDate?: Date;
  value: string;

  constructor(now: Date = new Date(), date?: Date) {
    if (!date) {
      this.originalDate = date;
      this.value = "ASAP";
    } else {
      const diff = now.getTime() - date.getTime();

      if (diff < 1000 * 60 * 60 * 24 * 30) throw new Error("DesiredStartDate must be at least 30 days in the future");

      if (diff > 1000 * 60 * 60 * 24 * 365)
        throw new Error("DesiredStartDate must be less than 365 days in the future");

      this.originalDate = date;
      this.value = date.toISOString();
    }
  }
}

interface IIBanCode {
  value: string;
}

export class IBanCode implements IIBanCode {
  value: string;

  constructor(code: string) {
    if (code.length !== 16) throw new Error("IBAN has to be 16 characters long");

    if (/[\s-]/g.test(code)) throw new Error("IBAN can not contain spaces or -");
  }
}

interface IExportData {
  name: string;
  ibanCode: IBanCode;
  desiredStartDate: IDesiredStartDate;
  currentProviderCode: CurrentProviderCode;
}

export class ExportData implements IExportData {
  name: string;
  ibanCode: IBanCode;
  desiredStartDate: IDesiredStartDate;
  currentProviderCode: CurrentProviderCode;

  constructor(name: string, ibanCode: IBanCode, currentProvider: ProviderName, desiredStartDate: IDesiredStartDate) {
    this.name = name;
    // Perfect values to add a wrapper type to since there is a bunch of logic
    this.ibanCode = ibanCode;
    this.desiredStartDate = desiredStartDate;
    // currentProviderCode never exists in a state other than as a code so we don't need to type it but we could
    this.currentProviderCode = getCurrentProviderCode(currentProvider);
  }
}

type ProviderName = string;
type CurrentProviderCode = string;

const getCurrentProviderCode = (currentProvider: ProviderName): CurrentProviderCode => {
  const result: string | undefined = providerCodeMap.get(currentProvider);

  if (result === undefined) throw new Error(`Could not find code for ${currentProvider}`);

  return result;
};

const providerCodeMap = new Map<ProviderName, CurrentProviderCode>([
  ["foo", "123"],
  ["bar", "456"],
  ["baz", "789"],
]);
