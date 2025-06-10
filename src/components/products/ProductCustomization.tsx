
'use client';

import type { CustomizationOption, SelectedCustomizations, CustomizationOptionChoice } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings2 } from 'lucide-react';
import { useEffect } from 'react';

interface ProductCustomizationProps {
  options: CustomizationOption[];
  selectedCustomizations: SelectedCustomizations;
  onCustomizationChange: (optionId: string, value: string) => void;
}

export function ProductCustomization({ options, selectedCustomizations, onCustomizationChange }: ProductCustomizationProps) {
  if (!options || options.length === 0) {
    return null;
  }

  // Set default values on initial render
  useEffect(() => {
    options.forEach(option => {
      if (option.defaultValue && selectedCustomizations[option.id] === undefined) {
        onCustomizationChange(option.id, option.defaultValue);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Settings2 className="mr-2 h-5 w-5 text-primary" />
          Customize Your Product
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {options.map((option) => (
          <div key={option.id} className="space-y-2">
            <Label htmlFor={option.id} className="text-base font-medium">
              {option.name}
            </Label>
            {option.type === 'select' && option.choices && (
              <Select
                value={selectedCustomizations[option.id] || option.defaultValue || ''}
                onValueChange={(value) => onCustomizationChange(option.id, value)}
              >
                <SelectTrigger id={option.id} className="w-full">
                  <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {option.choices.map((choice) => (
                    <SelectItem key={choice.value} value={choice.value}>
                      {choice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {option.type === 'radio' && option.choices && (
              <RadioGroup
                id={option.id}
                value={selectedCustomizations[option.id] || option.defaultValue || ''}
                onValueChange={(value) => onCustomizationChange(option.id, value)}
                className="flex flex-wrap gap-4"
              >
                {option.choices.map((choice) => (
                  <div key={choice.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={choice.value} id={`${option.id}-${choice.value}`} />
                    <Label htmlFor={`${option.id}-${choice.value}`} className="font-normal">
                      {choice.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            {option.type === 'text' && (
              <Input
                id={option.id}
                type="text"
                placeholder={option.placeholder || `Enter ${option.name.toLowerCase()}`}
                value={selectedCustomizations[option.id] || option.defaultValue || ''}
                onChange={(e) => onCustomizationChange(option.id, e.target.value)}
                className="w-full"
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
