import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
};

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
};

export function formatCurrency(value: number) {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};

export function calculatePercentageChange(
  current: number,
  previous: number,
) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
};

export function fillMissingDays(
  activeDays: {
    date: Date,
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) {
      return found;
    } else {
      return {
        date: day,
        income: 0,
        expenses: 0,
      };
    }
  });

  return transactionsByDay;
};

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export function formatDateRange (period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, "dd LLL")} - ${format(defaultTo, "dd LLL, y")}`;
  }

  if (period.to) {
    return `${format(period.from, "dd LLL")} - ${format(period.to, "dd LLL, y")}`;
  }

  return format(period.from, "dd LLL, y");
};

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = {
    addPrefix: false,
  },
) {
  const result = new Intl.NumberFormat("pt-BR", {
    style: "percent",
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
};


  // Função para aplicar a máscara de CPF
  export function maskCpf (value: any) {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Adiciona o traço
      .replace(/(-\d{2})\d+?$/, '$1'); // Limita a 11 dígitos e 2 do traço
  };

  // Função para aplicar a máscara de telefone celular
  export function maskPhone (value: any){
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/^(\d{2})(\d)/, '($1) $2') // Adiciona os parênteses no DDD
      .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o traço no número do celular
      .replace(/(-\d{4})\d+?$/, '$1'); // Limita a 11 dígitos
  };

  // Função para validar o e-mail
  export function maskEmail(value: any) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(value).toLowerCase());
  };
  // Função para validar o data de nascimento
  export function maskBirthDate (value: string)  {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{2})(\d)/, '$1/$2') // Adiciona a primeira barra
      .replace(/(\d{2})(\d)/, '$1/$2') // Adiciona a segunda barra
      .replace(/(\d{4})\d+?$/, '$1'); // Limita a 8 dígitos
  };

  export function  maskCep(value: any) {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o traço
      .replace(/(-\d{3})\d+?$/, '$1'); // Limita a 8 dígitos
  };
