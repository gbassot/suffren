import {Opportunity} from "../data/opportunity.model";

export class QuoteState {
  opportunities: Opportunity[];
  activeOpportunity: number;
}
